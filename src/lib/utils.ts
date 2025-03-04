import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif'
  ].includes(ext)
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return [
    'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm4v'
  ].includes(ext)
}

export function getMediaType(filename: string): 'image' | 'video' | null {
  if (isImageFile(filename)) return 'image'
  if (isVideoFile(filename)) return 'video'
  return null
}
