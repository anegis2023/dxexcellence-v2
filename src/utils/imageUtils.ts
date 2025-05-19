/**
 * Utility functions for handling images
 */

// This function will dynamically import all background images
export function importBackgroundImages() {
  // Use Vite's import.meta.glob to get all jpg/png files from the templates directory
  const imageModules = import.meta.glob('../assets/templates/*.{jpg,jpeg,png}', { eager: true });
  
  // Define color schemes for specific template files
  const templateColors: Record<string, { primaryColor: string; textColor: string }> = {
    // Default colors (used if no specific match is found)
    default: { primaryColor: '#72edff', textColor: '#7FE7F3' },
    
    // English templates
    'ENGLISH template for attende.png': { primaryColor: '#72edff', textColor: '#72edff' },
    'ENGLISH template for attende 2.png': { primaryColor: '#380e5b', textColor: '#380e5b' },
    'ENGLISH template for attende 3.png': { primaryColor: '#380e5b', textColor: '#380e5b' },
    
    // Polish templates
    'POLISH template for attende.png': { primaryColor: '#72edff', textColor: '#72edff' },
    'POLISH template for attende 2.png': { primaryColor: '#380e5b', textColor: '#380e5b' },
    'POLISH template for attende 3.png': { primaryColor: '#380e5b', textColor: '#380e5b' },
  };
  
  // Transform the modules into a usable format for our templates
  const images = Object.entries(imageModules).map(([path, module]: [string, any], index) => {
    // Extract the filename without extension to use as the template name
    const filename = path.split('/').pop() || '';
    const name = filename
      .replace(/\.(jpg|jpeg|png)$/i, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Determine which color scheme to use based on exact filename
    // Use the specific color scheme if it exists, otherwise use the default
    const colorScheme = templateColors[filename] || templateColors.default;
    
    return {
      id: String(index + 1),
      name,
      imageUrl: module.default,
      primaryColor: colorScheme.primaryColor,
      textColor: colorScheme.textColor
    };
  });
  
  return images;
}
