import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MediaViewer from '@/components/MediaViewer'
import { MediaFile } from '@/types'

const MediaViewPage: React.FC = () => {
  const { mediaId } = useParams<{ mediaId: string }>()
  const navigate = useNavigate()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadAllMedia = async () => {
      setLoading(true)
      try {
        const allMedia = await window.electronAPI?.getAllMedia()
        setMediaFiles(allMedia || [])
        
        if (mediaId && allMedia) {
          const index = allMedia.findIndex(m => m.id === parseInt(mediaId))
          if (index !== -1) {
            setCurrentIndex(index)
          }
        }
      } catch (error) {
        console.error('Error loading media:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadAllMedia()
  }, [mediaId])

  const handleClose = () => {
    navigate(-1)
  }

  const handleNext = () => {
    if (currentIndex < mediaFiles.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      navigate(`/view/${mediaFiles[nextIndex].id}`)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      navigate(`/view/${mediaFiles[prevIndex].id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (mediaFiles.length === 0 || currentIndex < 0 || currentIndex >= mediaFiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-4">Media not found</p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => navigate('/gallery')}
        >
          Back to Gallery
        </button>
      </div>
    )
  }

  const currentMedia = mediaFiles[currentIndex]

  return (
    <MediaViewer
      media={currentMedia}
      onClose={handleClose}
      onNext={handleNext}
      onPrevious={handlePrevious}
      hasNext={currentIndex < mediaFiles.length - 1}
      hasPrevious={currentIndex > 0}
    />
  )
}

export default MediaViewPage
