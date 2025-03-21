
import { ImageItem } from '@/components/Gallery';

// Default to the environment variable if available, otherwise use a relative path
// This allows the API to work both in development and when deployed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Add some debug logging to help troubleshoot the connection
console.log("API Base URL:", API_BASE_URL);

/**
 * Fetches images from the specified directory on the backend
 */
export async function fetchImages(directory: string): Promise<ImageItem[]> {
  const url = `${API_BASE_URL}/images?directory=${encodeURIComponent(directory)}`;
  console.log("Fetching images from:", url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received image data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

/**
 * Deletes the specified images on the backend
 */
export async function deleteImages(imageIds: string[]): Promise<{ success: boolean, message: string }> {
  const url = `${API_BASE_URL}/images`;
  console.log("Deleting images at:", url, "IDs:", imageIds);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to delete images: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Delete response:", data);
    return data;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
}
