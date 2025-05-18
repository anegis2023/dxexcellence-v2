/**
 * Utility functions for handling images
 */

// This function will dynamically import all background images
export function importBackgroundImages() {
  // Use Vite's import.meta.glob to get all jpg/png files from the templates directory
  const imageModules = import.meta.glob('../assets/templates/*.{jpg,jpeg,png}', { eager: true });
  
  // Transform the modules into a usable format for our templates
  const images = Object.entries(imageModules).map(([path, module]: [string, any], index) => {
    // Extract the filename without extension to use as the template name
    const filename = path.split('/').pop() || '';
    const name = filename
      .replace(/\.(jpg|jpeg|png)$/i, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      id: String(index + 1),
      name,
      imageUrl: module.default
    };
  });
  
  return images;
}
