import React, { useState, useEffect } from 'react'
import { Heart, Copy, Download, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/button'
import { MediaFile } from '@/types'

interface MediaViewerProps {
  media: MediaFile
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}) => {
  const [isFavorite, setIsFavorite] = useState(media.favorite)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setIsFavorite(media.favorite)
  }, [media])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await window.electronAPI?.toggleFavorite({
        filePath: media.path,
        favorite: !isFavorite
      })
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
    if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) onPrevious()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [hasNext, hasPrevious])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">{media.name}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFavorite}>
            <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Copy size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Download size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {media.type === 'image' ? (
          <img 
            src={`file://${media.path}`} 
            alt={media.name}
            className={`max-h-full max-w-full object-contain ${isFullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={isFullscreen ? { objectFit: 'cover', width: '100%', height: '100%' } : {}}
          />
        ) : (
          <video 
            src={`file://${media.path}`}
            className="max-h-full max-w-full"
            controls
            autoPlay
          />
        )}
        
        {hasPrevious && (
          <Button 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
            size="icon"
            onClick={onPrevious}
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        
        {hasNext && (
          <Button 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
            size="icon"
            onClick={onNext}
          >
            <ChevronRight size={24} />
          </Button>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2">
          {media.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MediaViewer
