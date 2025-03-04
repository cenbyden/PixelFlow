import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function setupDatabase() {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'media-manager.db')
  
  // Ensure the directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true })
  }
  
  const db = new Database(dbPath)
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE,
      name TEXT,
      type TEXT,
      size INTEGER,
      last_modified TEXT,
      tags TEXT,
      favorite INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      created_at TEXT
    );
    
    CREATE TABLE IF NOT EXISTS collection_items (
      collection_id INTEGER,
      media_id INTEGER,
      PRIMARY KEY (collection_id, media_id),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY (media_id) REFERENCES media_files(id) ON DELETE CASCADE
    );
  `)
  
  return db
}
