import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { useTranslation } from 'react-i18next';

const PhotoUpload: React.FC = () => {
  const { t } = useTranslation();
  const { userPhoto, setUserPhoto } = useEventContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    const reader = new FileReader();
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert(t('photoUpload.error'));
      return;
    }
    
    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            setUserPhoto(e.target.result);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      }
    }, 100);
  };
  
  const handleRemovePhoto = () => {
    setUserPhoto(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="photo-upload-container">
      {!userPhoto ? (
        <div
          className={`photo-upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
            accept="image/*"
          />
          
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {t('photoUpload.title')}
          </h3>
          
          <p className="text-sm text-gray-500 mb-4" data-component-name="PhotoUpload">
            {t('photoUpload.dragDrop')}
          </p>

          <p className="text-xs text-gray-400 mb-2" data-component-name="PhotoUpload">
            {t('photoUpload.recommended')}
          </p>
          <p className="text-xs text-gray-400 mb-4" data-component-name="PhotoUpload">
            {t('photoUpload.supports')}
          </p>
          
          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t('photoUpload.uploading')} {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="photo-preview loaded rounded-lg overflow-hidden relative">
          <img 
            src={userPhoto} 
            alt="Uploaded preview" 
            className="w-full h-auto max-h-96 object-contain mx-auto"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={handleRemovePhoto}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              title="Remove photo"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center bg-green-50 text-green-700 p-2 rounded">
            <Check size={20} className="mr-2" />
            <span>{t('photoUpload.success')}</span>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 text-center">
            {t('photoUpload.replace')}
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <h3 className="font-medium text-[#380e5b] mb-2">{t('photoUpload.guidelines.title')}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {t('photoUpload.guidelines.square')}</li>
          <li>• {t('photoUpload.guidelines.professional')}</li>
          <li>• {t('photoUpload.guidelines.lighting')}</li>
          <li>• {t('photoUpload.guidelines.visible')}</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;