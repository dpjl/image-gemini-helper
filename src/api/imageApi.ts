
import { ImageItem } from '@/components/Gallery';

// This should be updated to your actual Python backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches images from the specified directory on the backend
 */
export async function fetchImages(directory: string): Promise<ImageItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/images?directory=${encodeURIComponent(directory)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

/**
 * Deletes the specified images on the backend
 */
export async function deleteImages(imageIds: string[]): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete images: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
}
