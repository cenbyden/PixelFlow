import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, Image, Heart, Layers, Settings } from 'lucide-react'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  
  const features = [
    {
      icon: <FolderOpen size={24} />,
      title: 'Browse Files',
      description: 'Navigate through your local folders to find images and videos',
      action: () => window.electronAPI?.openDirectory(),
    },
    {
      icon: <Image size={24} />,
      title: 'Media Gallery',
      description: 'View all your media files in a responsive thumbnail grid',
      action: () => navigate('/gallery'),
    },
    {
      icon: <Heart size={24} />,
      title: 'Favorites',
      description: 'Access your favorite media files quickly',
      action: () => navigate('/favorites'),
    },
    {
      icon: <Layers size={24} />,
      title: 'Collections',
      description: 'Organize your media into custom collections',
      action: () => navigate('/collections'),
    },
    {
      icon: <Settings size={24} />,
      title: 'Settings',
      description: 'Customize PixelFlow to suit your preferences',
      action: () => navigate('/settings'),
    }
  ]
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to PixelFlow</h1>
        <p className="text-muted-foreground">
          Your desktop application for browsing and managing local images and videos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="border rounded-lg p-6 hover:border-primary cursor-pointer transition-all bg-card"
            onClick={feature.action}
          >
            <div className="mb-4 text-primary">{feature.icon}</div>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-medium mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Click on <strong>Open Folder</strong> to browse your file system</li>
          <li>Navigate to the <strong>Gallery</strong> to view all your media files</li>
          <li>Mark your favorite items with the <strong>heart icon</strong></li>
          <li>Create <strong>Collections</strong> to organize related media</li>
          <li>Customize the application in <strong>Settings</strong></li>
        </ol>
      </div>
    </div>
  )
}

export default HomePage
