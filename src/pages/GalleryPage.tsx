import React, { useState, useEffect } from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MediaGrid from '@/components/MediaGrid'
import { MediaFile } from '@/types'

const GalleryPage: React.FC = () => {
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const handleOpenDirectory = async () => {
    try {
      const selectedDir = await window.electronAPI?.openDirectory()
      if (selectedDir) {
        setCurrentDirectory(selectedDir)
        loadMediaFiles(selectedDir)
      }
    } catch (error) {
      console.error('Error opening directory:', error)
    }
  }

  const loadMediaFiles = async (directoryPath: string) => {
    setLoading(true)
    try {
      const files = await window.electronAPI?.readDirectory(directoryPath)
      
      // Get metadata for each file and save it to the database
      const filesWithMetadata = await Promise.all(
        files.map(async (file) => {
          let metadata = await window.electronAPI?.getMediaMetadata(file.path)
          
          if (!metadata) {
            // If no metadata exists, save it to the database
            await window.electronAPI?.saveMediaMetadata({
              ...file,
              tags: [],
              favorite: false
            })
            
            // Get the saved metadata
            metadata = await window.electronAPI?.getMediaMetadata(file.path)
          }
          
          return metadata || file
        })
      )
      
      setMediaFiles(filesWithMetadata)
    } catch (error) {
      console.error('Error loading media files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentDirectory) {
      loadMediaFiles(currentDirectory)
    }
  }, [currentDirectory])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button onClick={handleOpenDirectory}>
          <FolderOpen className="mr-2" size={18} />
          Open Folder
        </Button>
      </div>
      
      {currentDirectory && (
        <div className="mb-4 p-2 bg-muted rounded-md overflow-x-auto">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Current directory: <span className="font-mono">{currentDirectory}</span>
          </p>
        </div>
      )}
      
      <MediaGrid media={mediaFiles} loading={loading} />
    </div>
  )
}

export default GalleryPage
