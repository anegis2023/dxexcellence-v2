import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config';

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  try {
    console.log('Initializing EmailJS with public key:', EMAIL_CONFIG.PUBLIC_KEY.substring(0, 4) + '...');
    console.log('Service ID:', EMAIL_CONFIG.SERVICE_ID);
    console.log('Template ID:', EMAIL_CONFIG.TEMPLATE_ID);
    
    // Check if we have all required configuration
    if (!EMAIL_CONFIG.PUBLIC_KEY || EMAIL_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.error('Missing PUBLIC_KEY configuration');
      return;
    }
    
    if (!EMAIL_CONFIG.SERVICE_ID || EMAIL_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
      console.error('Missing SERVICE_ID configuration');
      return;
    }
    
    if (!EMAIL_CONFIG.TEMPLATE_ID || EMAIL_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      console.error('Missing TEMPLATE_ID configuration');
      return;
    }
    
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    console.log('EmailJS initialized successfully');
  } catch (error) {
    console.error('Error initializing EmailJS:', error);
  }
};

// Function to compress an image to fit within EmailJS size limits (500KB)
const compressImageForEmail = (canvas: HTMLCanvasElement, maxSizeKB: number = 500): string => {
  // Start with high quality
  let quality = 0.9;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  let estimatedSize = Math.round((dataUrl.length * 3) / 4); // Rough estimate of base64 size
  
  console.log(`Initial image size with quality ${quality}: ${Math.round(estimatedSize / 1024)} KB`);
  
  // Gradually reduce quality until the image is under the size limit
  while (estimatedSize > maxSizeKB * 1024 && quality > 0.1) {
    quality -= 0.1;
    quality = Math.max(0.1, quality); // Don't go below 0.1
    
    dataUrl = canvas.toDataURL('image/jpeg', quality);
    estimatedSize = Math.round((dataUrl.length * 3) / 4);
    
    console.log(`Compressed image with quality ${quality.toFixed(1)}: ${Math.round(estimatedSize / 1024)} KB`);
  }
  
  // If still too large, resize the canvas
  if (estimatedSize > maxSizeKB * 1024) {
    console.log('Image still too large after quality reduction, resizing...');
    
    // Create a temporary canvas for resizing
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context for resizing');
    }
    
    // Start with 90% of original size and reduce until under limit
    let scale = 0.9;
    
    while (estimatedSize > maxSizeKB * 1024 && scale > 0.3) {
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      
      // Draw the original canvas onto the smaller canvas
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 
                   0, 0, tempCanvas.width, tempCanvas.height);
      
      dataUrl = tempCanvas.toDataURL('image/jpeg', quality);
      estimatedSize = Math.round((dataUrl.length * 3) / 4);
      
      console.log(`Resized to ${Math.round(scale * 100)}% with size: ${Math.round(estimatedSize / 1024)} KB`);
      
      scale -= 0.1;
    }
  }
  
  console.log(`Final image size: ${Math.round(estimatedSize / 1024)} KB`);
  return dataUrl;
};

// Function to send email with canvas image attachment
export const sendGraphicByEmail = async (
  email: string, 
  canvas: HTMLCanvasElement, 
  userName: string
) => {
  try {
    console.log('Preparing to send email to:', email);
    console.log('Using service ID:', EMAIL_CONFIG.SERVICE_ID);
    console.log('Using template ID:', EMAIL_CONFIG.TEMPLATE_ID);
    
    // Check if EmailJS is properly configured
    if (!EMAIL_CONFIG.PUBLIC_KEY || EMAIL_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      throw new Error('EmailJS public key is not configured');
    }
    
    if (!EMAIL_CONFIG.SERVICE_ID || EMAIL_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
      throw new Error('EmailJS service ID is not configured');
    }
    
    if (!EMAIL_CONFIG.TEMPLATE_ID || EMAIL_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      throw new Error('EmailJS template ID is not configured');
    }
    
    // Compress the image to ensure it's under 500KB for EmailJS
    console.log('Compressing image for email attachment...');
    const compressedDataUrl = compressImageForEmail(canvas, 480); // Slightly under 500KB to be safe
    
    // Remove the data:image/jpeg;base64, prefix
    const base64Image = compressedDataUrl.split(',')[1];
    
    // Prepare template parameters
    const templateParams = {
      to_email: email,
      user_name: userName || 'User',
      message: `Here's your DX EXCELLENCE conference graphic!`,
      graphic_content: base64Image // This name must match the parameter name in EmailJS template
    };
    
    console.log('Sending email with compressed attachment...');
    
    // Send email with the base64 image data
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams
    );
    
    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending email:", error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      success: false, 
      error,
      message: errorMessage
    };
  }
};
