import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Edit } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { MediaFile } from '@/types'

interface MediaGridProps {
  media: MediaFile[]
  loading?: boolean
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, loading = false }) => {
  const navigate = useNavigate()

  const handleMediaClick = (mediaId: number) => {
    navigate(`/view/${mediaId}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div 
            key={index} 
            className="aspect-square rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>No media files found</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => window.electronAPI?.openDirectory()}
        >
          Open Folder
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {media.map((item) => (
        <div 
          key={item.path} 
          className="group relative aspect-square rounded-md overflow-hidden border bg-card hover:border-primary cursor-pointer transition-all"
          onClick={() => item.id && handleMediaClick(item.id)}
        >
          {item.type === 'image' ? (
            <img 
              src={`file://${item.path}`} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video 
                src={`file://${item.path}`}
                className="max-w-full max-h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
            <p className="text-white text-sm truncate">{item.name}</p>
            <p className="text-white/70 text-xs">{formatFileSize(item.size)}</p>
          </div>
          
          {item.favorite && (
            <div className="absolute top-2 right-2">
              <Heart className="fill-red-500 text-red-500" size={18} />
            </div>
          )}
          
          {item.tags?.includes('edited') && (
            <div className="absolute top-2 left-2">
              <Edit className="text-blue-500" size={18} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MediaGrid
