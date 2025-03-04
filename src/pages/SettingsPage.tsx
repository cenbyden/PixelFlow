import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    thumbnailSize: 'medium',
    theme: 'system',
    autoPlay: true,
    defaultSortOrder: 'name'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleSave = () => {
    // Save settings to electron store
    console.log('Saving settings:', settings)
    // This would be implemented with an IPC call to the main process
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize PixelFlow to suit your preferences</p>
      </div>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select 
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail Size</label>
              <select 
                name="thumbnailSize"
                value={settings.thumbnailSize}
                onChange={handleChange}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-medium mb-4">Media Playback</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="autoPlay"
                name="autoPlay"
                checked={settings.autoPlay}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="autoPlay" className="text-sm font-medium">Auto-play videos</label>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-medium mb-4">File Management</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Default Sort Order</label>
              <select 
                name="defaultSortOrder"
                value={settings.defaultSortOrder}
                onChange={handleChange}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="name">Name</option>
                <option value="date">Date Modified</option>
                <option value="size">Size</option>
                <option value="type">File Type</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
