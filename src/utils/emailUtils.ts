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
    
    // Convert canvas to base64 data URL
    const dataUrl = canvas.toDataURL('image/png');
    console.log('Image data URL length:', dataUrl.length);
    
    // Check if the image is too large (EmailJS has a 4MB limit)
    const estimatedSize = Math.round((dataUrl.length * 3) / 4); // Rough estimate of base64 size
    console.log('Estimated attachment size:', Math.round(estimatedSize / 1024), 'KB');
    
    if (estimatedSize > 4 * 1024 * 1024) {
      throw new Error('Image is too large to send via email (over 4MB)');
    }
    
    // Remove the data:image/png;base64, prefix
    const base64Image = dataUrl.split(',')[1];
    
    // Prepare template parameters
    const templateParams = {
      to_email: email,
      user_name: userName || 'User',
      message: `Here's your DX EXCELLENCE conference graphic!`,
      graphic_content: base64Image // This name must match the parameter name in EmailJS template
    };
    
    console.log('Sending email with attachment...');
    
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
