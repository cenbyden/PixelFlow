import React, { useState } from 'react'
import { Folder, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Collection {
  id: number
  name: string
  itemCount: number
}

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([
    // Placeholder collections - will be replaced with actual data from the database
    { id: 1, name: 'Vacation 2023', itemCount: 42 },
    { id: 2, name: 'Family Photos', itemCount: 128 },
    { id: 3, name: 'Work Projects', itemCount: 17 }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Organize your media into custom collections</p>
        </div>
        <Button>
          <Plus className="mr-2" size={18} />
          New Collection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map(collection => (
          <div 
            key={collection.id}
            className="border rounded-lg p-6 hover:border-primary cursor-pointer transition-all bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Folder className="text-primary" size={24} />
              <h3 className="text-lg font-medium">{collection.name}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{collection.itemCount} items</p>
          </div>
        ))}
      </div>
      
      {collections.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Folder size={48} className="mb-4 opacity-50" />
          <p>No collections yet</p>
          <Button className="mt-4">
            <Plus className="mr-2" size={18} />
            Create Collection
          </Button>
        </div>
      )}
    </div>
  )
}

export default CollectionsPage
