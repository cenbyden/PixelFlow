import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import isDev from 'electron-is-dev'
import { setupDatabase } from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow
let db

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../dist/index.html')}`
  
  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  db = setupDatabase()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (!canceled) {
    return filePaths[0]
  }
  return null
})

ipcMain.handle('fs:readDirectory', async (_, directoryPath) => {
  try {
    const files = await fs.promises.readdir(directoryPath)
    const mediaFiles = []

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stats = await fs.promises.stat(filePath)
      
      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase()
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
        const isVideo = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'].includes(ext)
        
        if (isImage || isVideo) {
          mediaFiles.push({
            name: file,
            path: filePath,
            type: isImage ? 'image' : 'video',
            size: stats.size,
            lastModified: stats.mtime.toISOString()
          })
        }
      }
    }
    
    return mediaFiles
  } catch (error) {
    console.error('Error reading directory:', error)
    throw error
  }
})

ipcMain.handle('db:saveMediaMetadata', async (_, mediaData) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO media_files (path, name, type, size, last_modified, tags, favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      mediaData.path,
      mediaData.name,
      mediaData.type,
      mediaData.size,
      mediaData.lastModified,
      JSON.stringify(mediaData.tags || []),
      mediaData.favorite ? 1 : 0
    )
    
    return { success: true }
  } catch (error) {
    console.error('Error saving media metadata:', error)
    throw error
  }
})

ipcMain.handle('db:getMediaMetadata', async (_, filePath) => {
  try {
    const stmt = db.prepare('SELECT * FROM media_files WHERE path = ?')
    const result = stmt.get(filePath)
    
    if (result) {
      result.tags = JSON.parse(result.tags || '[]')
      result.favorite = Boolean(result.favorite)
    }
    
    return result || null
  } catch (error) {
    console.error('Error getting media metadata:', error)
    throw error
  }
})

ipcMain.handle('db:getAllMedia', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM media_files')
    const results = stmt.all()
    
    return results.map(item => ({
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      favorite: Boolean(item.favorite)
    }))
  } catch (error) {
    console.error('Error getting all media:', error)
    throw error
  }
})

ipcMain.handle('db:updateMediaTags', async (_, { filePath, tags }) => {
  try {
    const stmt = db.prepare('UPDATE media_files SET tags = ? WHERE path = ?')
    stmt.run(JSON.stringify(tags), filePath)
    return { success: true }
  } catch (error) {
    console.error('Error updating media tags:', error)
    throw error
  }
})

ipcMain.handle('db:toggleFavorite', async (_, { filePath, favorite }) => {
  try {
    const stmt = db.prepare('UPDATE media_files SET favorite = ? WHERE path = ?')
    stmt.run(favorite ? 1 : 0, filePath)
    return { success: true }
  } catch (error) {
    console.error('Error toggling favorite status:', error)
    throw error
  }
})
