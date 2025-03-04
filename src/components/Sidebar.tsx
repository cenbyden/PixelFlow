import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  FolderOpen, 
  Heart, 
  Layers, 
  Settings,
  Image
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/gallery', icon: <Image size={20} />, label: 'Gallery' },
    { to: '/favorites', icon: <Heart size={20} />, label: 'Favorites' },
    { to: '/collections', icon: <Layers size={20} />, label: 'Collections' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ]

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-4 flex items-center gap-2 border-b">
        <FolderOpen className="text-primary" size={24} />
        <span className="font-bold text-lg">PixelFlow</span>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button 
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
          onClick={() => window.electronAPI?.openDirectory()}
        >
          <FolderOpen size={20} />
          <span>Open Folder</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
