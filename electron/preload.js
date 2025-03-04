import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readDirectory: (path) => ipcRenderer.invoke('fs:readDirectory', path),
  
  // Database operations
  saveMediaMetadata: (mediaData) => ipcRenderer.invoke('db:saveMediaMetadata', mediaData),
  getMediaMetadata: (filePath) => ipcRenderer.invoke('db:getMediaMetadata', filePath),
  getAllMedia: () => ipcRenderer.invoke('db:getAllMedia'),
  updateMediaTags: (data) => ipcRenderer.invoke('db:updateMediaTags', data),
  toggleFavorite: (data) => ipcRenderer.invoke('db:toggleFavorite', data)
})
