import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config';

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  try {
    console.log('Initializing EmailJS with public key:', EMAIL_CONFIG.PUBLIC_KEY.substring(0, 4) + '...');
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
    
    // Convert canvas to base64 data URL
    // Remove the data:image/png;base64, prefix as EmailJS may handle it better this way
    const base64Image = canvas.toDataURL('image/png').split(',')[1];
    
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
    return { success: false, error };
  }
};
