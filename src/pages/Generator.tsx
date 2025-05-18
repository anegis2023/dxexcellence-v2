import React, { useState, useEffect } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import TemplateSelector from '../components/TemplateSelector';
import GraphicPreview from '../components/GraphicPreview';
import UserForm from '../components/UserForm';
import { useEventContext } from '../context/EventContext';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';

const Generator: React.FC = () => {
  const { userPhoto, userName, userEmail, selectedTemplate } = useEventContext();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      // If you want to pre-fill the email from URL
      // setUserEmail(emailParam);
    }
  }, []);
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const previewElement = document.getElementById('graphic-preview');
      if (!previewElement) return;

      const canvas = await html2canvas(previewElement, {
        width: 1080,
        height: 1080,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('graphic-preview');
          if (clonedElement) {
            // Set the container size
            clonedElement.style.width = '1080px';
            clonedElement.style.height = '1080px';
            
            // Profile image container
            const profileContainer = clonedElement.querySelector('.profile-container') as HTMLElement;
            if (profileContainer) {
              profileContainer.style.width = '540px';
              profileContainer.style.height = '540px';
            }

            // Scale the text
            const title = clonedElement.querySelector('h4');
            if (title) {
              title.style.fontSize = '72px';
              title.style.marginBottom = '24px';
            }
            
            // Fix the name position
            const nameContainer = clonedElement.querySelector('.absolute.bottom-24');
            if (nameContainer) {
              // Maintain the same position ratio as in the preview
              // In preview the container is 600px and bottom-24 (96px)
              // For 1080px we need to scale proportionally
              (nameContainer as HTMLElement).style.bottom = '172px';
              (nameContainer as HTMLElement).style.width = '100%';
              (nameContainer as HTMLElement).style.padding = '0 36px';
            }
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `dx-excellents-conference-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
      alert('There was an error generating your image. Please try again.');
    }
  };
  
  const canProceedToStep2 = !!userPhoto;
  const canProceedToStep3 = !!userName && !!userEmail;
  const canProceedToStep4 = selectedTemplate !== -1;
  const canDownload = userPhoto && userName && userEmail && selectedTemplate !== -1;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" style={{ background: 'linear-gradient(to right, #a0f2fe, #f6f6db)' }}>
      <h1 className="text-3xl font-bold text-center mb-8 text-[#380e5b]">
        Create Your DX EXCELLENCE conference graphics
      </h1>
      
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step}
              className={`flex flex-col items-center ${currentStep >= step ? 'text-[#380e5b]' : 'text-gray-400'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 ${
                  currentStep > step 
                    ? 'bg-[#72edff]' 
                    : currentStep === step 
                      ? 'bg-[#380e5b]' 
                      : 'bg-[#dbe2fe]'
                }`}
              >
                {step}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step === 1 && 'Upload Photo'}
                {step === 2 && 'Your Details'}
                {step === 3 && 'Select Template'}
                {step === 4 && 'Preview & Download'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="h-2 w-full bg-[#dbe2fe] rounded-full mt-4 max-w-3xl mx-auto">
          <div 
            className="h-full bg-[#380e5b] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-[#380e5b]">Upload Your photo</h2>
            <PhotoUpload />
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-[#380e5b]">Enter Your details</h2>
            <UserForm />
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-[#380e5b]">Choose a template</h2>
            <TemplateSelector />
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-[#380e5b]">Preview & Download</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <GraphicPreview />
              </div>
              <div className="md:w-1/3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-[#380e5b]">Your information</h3>
                  <p className="mb-1"><span className="font-medium">Name:</span> {userName}</p>
                  <p className="mb-4"><span className="font-medium">Email:</span> {userEmail}</p>
                  
                  <button
                    onClick={handleDownload}
                    disabled={!canDownload || isGenerating}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium ${
                      canDownload && !isGenerating
                        ? 'bg-[#72edff] text-[#380e5b] hover:bg-[#5ad8e9]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        <span>Download Graphic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#380e5b] text-white hover:bg-[#4d1a76]'
            } transition-colors duration-200`}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              disabled={(currentStep === 1 && !canProceedToStep2) || 
                       (currentStep === 2 && !canProceedToStep3) || 
                       (currentStep === 3 && !canProceedToStep4)}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium ${
                (currentStep === 1 && !canProceedToStep2) || 
                (currentStep === 2 && !canProceedToStep3) || 
                (currentStep === 3 && !canProceedToStep4)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#72edff] text-[#380e5b] hover:bg-[#5ad8e9]'
              } transition-colors duration-200`}
            >
              <span>Next</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;