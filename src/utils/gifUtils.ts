import GIF from 'gif.js';
import html2canvas from 'html2canvas';

// Define a vibrant color palette for the animation with more gradual transitions
const colorPalette = [
  '#380e5b', // Deep purple
  '#4a1a75', // Purple transition
  '#5c268f', // Medium purple
  '#6e32a9', // Purple transition
  '#8048c3', // Light purple
  '#925edd', // Purple to lavender transition
  '#a474f7', // Lavender
  '#b68aff', // Lavender to cyan transition
  '#94c8ff', // Light blue transition
  '#72edff', // Cyan
  '#4de8f5', // Cyan to teal transition
  '#28e3eb', // Light teal
  '#00d9e1', // Teal transition
  '#00c9c8', // Teal
  '#00b6b7', // Teal transition
  '#00a4a6', // Dark teal
  '#008c8e', // Teal transition
  '#007577', // Deep teal
  '#1a4268', // Teal to purple transition
  '#2d2e59', // Dark purple transition
  '#380e5b', // Back to start for smooth loop
];

// Function to interpolate between two colors
function interpolateColors(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const result = {
    r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor),
    g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor),
    b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor),
  };
  return rgbToHex(result);
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 }; // Return default black instead of null
}

// Helper function to convert RGB color to hex
function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
}

// Create a new animated GIF with a color-changing ring
export const createAnimatedGif = (
  renderElement: HTMLDivElement,
  _userName: string | null, // Prefixed with underscore to indicate it's not used
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a new GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 1080,
        height: 1080,
        workerScript: '/gif.worker.js',
        debug: true
      });
      
      // Set up progress tracking
      if (onProgress) {
        gif.on('progress', onProgress);
      }
      
      // Number of frames for the animation
      const totalFrames = 30;
      const frames: HTMLCanvasElement[] = [];
      
      // First, create a deep clone of the render element to work with
      const workingElement = renderElement.cloneNode(true) as HTMLDivElement;
      document.body.appendChild(workingElement);
      workingElement.style.position = 'absolute';
      workingElement.style.left = '-9999px';
      workingElement.style.top = '-9999px';
      
      // Find the profile ring element
      let ringElement: HTMLElement | null = null;
      
      // Try multiple strategies to find the ring element
      // 1. Try by ID
      ringElement = workingElement.querySelector('#animated-profile-ring');
      
      // 2. Try by data attribute
      if (!ringElement) {
        ringElement = workingElement.querySelector('[data-is-ring="true"]');
      }
      
      // 3. Try by class name
      if (!ringElement) {
        ringElement = workingElement.querySelector('.profile-ring');
      }
      
      // 4. Try by style inspection - look for elements with border-radius: 50%
      if (!ringElement) {
        const allElements = workingElement.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          const style = window.getComputedStyle(el);
          if (style.borderRadius === '50%' && style.border && style.border !== 'none') {
            ringElement = el;
            break;
          }
        }
      }
      
      if (!ringElement) {
        console.error('Could not find profile ring element');
        reject(new Error('Could not find profile ring element'));
        return;
      }
      
      console.log('Found ring element:', ringElement);
      
      // Create a gradient effect that moves around the ring
      // We'll use a combination of box-shadow and border-color to create a glowing effect
      
      // Generate frames with different ring colors and glow effects
      for (let i = 0; i < totalFrames; i++) {
        // Calculate the position in the color palette (for smooth looping)
        const position = (i / totalFrames) * (colorPalette.length - 1);
        const colorIndex = Math.floor(position);
        const nextColorIndex = (colorIndex + 1) % colorPalette.length;
        
        // Calculate the interpolation factor between the two colors
        const factor = position - colorIndex;
        
        // Get the current and next colors
        const currentColor = colorPalette[colorIndex];
        const nextColor = colorPalette[nextColorIndex];
        
        // Interpolate between the two colors for smoother transitions
        const ringColor = interpolateColors(currentColor, nextColor, factor);
        
        // Calculate a gradient angle that moves around the ring (0 to 360 degrees)
        const gradientAngle = (i / totalFrames) * 360;
        
        console.log(`Creating frame ${i + 1}/${totalFrames} with color ${ringColor} at angle ${gradientAngle}°`);
        
        // Update ring color and add glow effect
        ringElement.style.borderColor = ringColor;
        ringElement.style.boxShadow = `0 0 15px 2px ${ringColor}, inset 0 0 8px 1px ${ringColor}`;
        
        // Create gradient border effect that moves around the ring
        const startColor = interpolateColors(currentColor, nextColor, (factor + 0.2) % 1);
        const endColor = interpolateColors(currentColor, nextColor, (factor + 0.7) % 1);
        
        ringElement.style.borderImage = 
          `linear-gradient(${gradientAngle}deg, ${startColor}, ${ringColor} 45%, ${endColor} 90%, ${startColor}) 1`;
        
        // Capture the frame
        const canvas = await html2canvas(workingElement, {
          backgroundColor: null,
          scale: 1,
          logging: false
        });
        
        // Save the frame
        frames.push(canvas);
      }
      
      // Clean up the working element
      document.body.removeChild(workingElement);
      
      // Add all frames to the GIF with variable delay for smoother animation
      frames.forEach(frame => {
        // Use a shorter delay for smoother animation
        gif.addFrame(frame, { delay: 80 });
      });
      
      // Render the GIF
      gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });
      
      gif.render();
      
    } catch (error) {
      console.error('Error creating animated GIF:', error);
      reject(error);
    }
  });
};
