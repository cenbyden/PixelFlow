export interface MediaFile {
  id?: number;
  path: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  lastModified: string;
  tags: string[];
  favorite: boolean;
}

export interface Collection {
  id: number;
  name: string;
  createdAt: string;
}

export interface ElectronAPI {
  openDirectory: () => Promise<string | null>;
  readDirectory: (path: string) => Promise<MediaFile[]>;
  saveMediaMetadata: (mediaData: MediaFile) => Promise<{ success: boolean }>;
  getMediaMetadata: (filePath: string) => Promise<MediaFile | null>;
  getAllMedia: () => Promise<MediaFile[]>;
  updateMediaTags: (data: { filePath: string; tags: string[] }) => Promise<{ success: boolean }>;
  toggleFavorite: (data: { filePath: string; favorite: boolean }) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
