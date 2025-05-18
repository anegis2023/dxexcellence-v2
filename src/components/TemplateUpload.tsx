import React, { useState } from 'react';
import { useEventContext } from '../context/EventContext';

const TemplateUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { templates, addTemplate } = useEventContext();

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    
    try {
      // In a real application, you would upload the file to a server here
      // For this demo, we'll simulate the upload with a timeout
      
      // Check if file is an image
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // In a real app, the server would save the file and return the URL
          // For now, we'll just create a local URL to demonstrate
          const imageUrl = URL.createObjectURL(file);
          
          // Add the new template to the context
          addTemplate({
            id: `custom-${Date.now()}`,
            name: file.name.replace(/\.(jpg|jpeg|png)$/i, '').replace(/-/g, ' '),
            imageUrl
          });
          
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            // Reset the file input
            event.target.value = '';
          }, 500);
        }
      }, 200);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload template');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="template-upload mt-8 border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Upload Your Own Template</h3>
      <p className="text-sm text-gray-600 mb-4">
        Upload your own background image to use as a template. Recommended size: 1080x1080px.
      </p>
      
      <div className="flex items-center space-x-3">
        <label 
          htmlFor="template-upload" 
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
            isUploading 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors duration-200`}
        >
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </label>
        <input 
          type="file" 
          id="template-upload" 
          className="hidden" 
          accept="image/*"
          onChange={handleTemplateUpload}
          disabled={isUploading}
        />
        
        <span className="text-sm text-gray-500">
          {templates.length} templates available
        </span>
      </div>
      
      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-200" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}
      
      {uploadError && (
        <p className="text-sm text-red-500 mt-2">{uploadError}</p>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> In this demo, uploaded templates are stored in memory and will be lost when you refresh the page.
          In a production environment, templates would be saved to the server and stored in the backgrounds folder.
        </p>
      </div>
    </div>
  );
};

export default TemplateUpload;
