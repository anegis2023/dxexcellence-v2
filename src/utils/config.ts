// EmailJS configuration
// To use this, create a .env file in the project root with the following variables:
// VITE_EMAILJS_PUBLIC_KEY=your_public_key
// VITE_EMAILJS_SERVICE_ID=your_service_id
// VITE_EMAILJS_TEMPLATE_ID=your_template_id
// VITE_EMAILJS_TEMPLATE_ID_PL=your_polish_template_id

// For development, you can replace these placeholders with your actual values
// For production, use environment variables
export const EMAIL_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
  TEMPLATE_ID_PL: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PL || "template_8g7m31n"
};
