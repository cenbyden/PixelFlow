import React, { useState, useEffect } from 'react'
import MediaGrid from '@/components/MediaGrid'
import { MediaFile } from '@/types'

const FavoritesPage: React.FC = () => {
  const [favoriteMedia, setFavoriteMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true)
      try {
        const allMedia = await window.electronAPI?.getAllMedia()
        const favorites = allMedia?.filter(media => media.favorite) || []
        setFavoriteMedia(favorites)
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFavorites()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-muted-foreground">Your favorite media files</p>
      </div>
      
      <MediaGrid media={favoriteMedia} loading={loading} />
    </div>
  )
}

export default FavoritesPage
