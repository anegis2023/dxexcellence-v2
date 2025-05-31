import React, { useState, useEffect } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import TemplateSelector from '../components/TemplateSelector';
import GraphicPreview from '../components/GraphicPreview';
import UserForm from '../components/UserForm';
import { useEventContext } from '../context/EventContext';
import { Download, ArrowLeft, ArrowRight, Mail, Check, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sendGraphicByEmail } from '../utils/emailUtils';

const Generator: React.FC = () => {
  const { userPhoto, userName, userEmail, selectedTemplate, templates } = useEventContext();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
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
  
  // Function to generate the image (shared between download and email)
  const generateImage = async () => {
    // Create a completely new element for rendering instead of using the preview
    const renderElement = document.createElement('div');
    renderElement.id = 'render-for-download';
    renderElement.style.position = 'absolute';
    renderElement.style.left = '-9999px';
    renderElement.style.top = '-9999px';
    document.body.appendChild(renderElement);
    
    // Get the selected template from context
    const template = selectedTemplate !== -1 ? templates[selectedTemplate] : null;
    if (!template) {
      throw new Error('No template selected');
    }
    
    // Set up the render element with exact dimensions
    renderElement.style.width = '1080px';
    renderElement.style.height = '1080px';
    renderElement.style.position = 'relative';
    renderElement.style.overflow = 'hidden';
    
    // Create and add the background
    const bgElement = document.createElement('div');
    bgElement.style.position = 'absolute';
    bgElement.style.top = '0';
    bgElement.style.left = '0';
    bgElement.style.width = '100%';
    bgElement.style.height = '100%';
    bgElement.style.backgroundImage = `url(${template.imageUrl})`;
    bgElement.style.backgroundSize = 'cover';
    bgElement.style.backgroundPosition = 'center';
    renderElement.appendChild(bgElement);
    
    // Create and add the profile image if it exists
    if (userPhoto) {
      const profileContainer = document.createElement('div');
      profileContainer.style.position = 'absolute';
      profileContainer.style.left = '50%';
      profileContainer.style.top = '50%';
      profileContainer.style.transform = 'translate(-50%, -50%) translateY(-10px)';
      profileContainer.style.width = '540px';
      profileContainer.style.height = '540px';
      
      const profileImgContainer = document.createElement('div');
      profileImgContainer.style.width = '100%';
      profileImgContainer.style.height = '100%';
      profileImgContainer.style.borderRadius = '50%';
      profileImgContainer.style.overflow = 'hidden';
      profileImgContainer.style.border = `16px solid ${template.primaryColor}`;
      profileImgContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      
      const profileImg = document.createElement('img');
      profileImg.src = userPhoto;
      profileImg.style.width = '100%';
      profileImg.style.height = '100%';
      profileImg.style.objectFit = 'cover';
      
      profileImgContainer.appendChild(profileImg);
      profileContainer.appendChild(profileImgContainer);
      renderElement.appendChild(profileContainer);
    }
    
    // Create and add the name
    const nameContainer = document.createElement('div');
    nameContainer.style.position = 'absolute';
    nameContainer.style.bottom = '200px';
    nameContainer.style.left = '0';
    nameContainer.style.width = '100%';
    nameContainer.style.textAlign = 'center';
    
    const nameText = document.createElement('h2');
    nameText.textContent = userName || 'Your Name';
    nameText.style.fontSize = '72px';
    nameText.style.fontWeight = 'bold';
    nameText.style.color = template.textColor;
    nameText.style.margin = '0';
    nameText.style.padding = '0';
    nameText.style.fontFamily = 'Arial, sans-serif';
    
    nameContainer.appendChild(nameText);
    renderElement.appendChild(nameContainer);
    
    try {
      // Convert the element to a canvas
      const canvas = await html2canvas(renderElement, {
        width: 1080,
        height: 1080,
        scale: 1
      });
      
      // Clean up
      document.body.removeChild(renderElement);
      
      return canvas;
    } catch (error) {
      // Clean up on error
      if (document.body.contains(renderElement)) {
        document.body.removeChild(renderElement);
      }
      throw error;
    }
  };
  
  // Send email with graphic
  const sendEmailWithGraphic = async (canvas: HTMLCanvasElement) => {
    if (!userEmail) return;
    
    setIsEmailSending(true);
    setEmailError(null);
    setEmailSent(false);
    
    try {
      console.log('Sending email to:', userEmail);
      console.log('Canvas dimensions for email:', canvas.width, 'x', canvas.height);
      
      const result = await sendGraphicByEmail(userEmail, canvas, userName || 'User');
      
      if (result.success) {
        console.log('Email sent successfully');
        setEmailSent(true);
      } else {
        // Get detailed error message
        const errorMessage = result.message || 'Failed to send email. Please try again.';
        console.error('Email sending failed with message:', errorMessage);
        
        // Check for common errors
        if (errorMessage.includes('size') || errorMessage.includes('KB') || errorMessage.includes('MB')) {
          setEmailError('Image was automatically compressed to fit email size limits.');
        } else if (errorMessage.includes('configured')) {
          setEmailError('Email service is not properly configured. Please check the console for details.');
        } else if (errorMessage.includes('context')) {
          setEmailError('Error processing image. Please try a different browser or device.');
        } else {
          setEmailError(`Failed to send email: ${errorMessage}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending email:', error);
      setEmailError(`An error occurred: ${errorMessage}`);
    } finally {
      setIsEmailSending(false);
    }
  };
  
  const handleDownload = async () => {
    setIsGenerating(true);
    setEmailSent(false);
    setEmailError(null);
    
    try {
      const canvas = await generateImage();
      
      // Create download link
      const link = document.createElement('a');
      link.download = `dx-excellence-${userName || 'graphic'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // If email is provided, also send via email
      if (userEmail) {
        await sendEmailWithGraphic(canvas);
      }
      
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
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
                      : 'bg-[#dacfe2]'
                }`}
              >
                {step}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step === 1 && 'Upload photo'}
                {step === 2 && 'Your details'}
                {step === 3 && 'Select template'}
                {step === 4 && 'Preview & Download'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="h-2 w-full bg-[#dacfe2] rounded-full mt-4 max-w-3xl mx-auto">
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
                    disabled={!canDownload || isGenerating || isEmailSending}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium ${
                      canDownload && !isGenerating && !isEmailSending
                        ? 'bg-[#72edff] text-[#380e5b] hover:bg-[#5ad8e9]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {isGenerating || isEmailSending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{isGenerating ? 'Generating...' : 'Sending Email...'}</span>
                      </>
                    ) : (
                      <>
                        {userEmail ? <Mail size={20} className="mr-1" /> : <Download size={20} />}
                        <span>{userEmail ? 'Download & Send graphic' : 'Download Graphic'}</span>
                      </>
                    )}
                  </button>
                  
                  {/* Email status indicators */}
                  {emailSent && (
                    <div className="mt-3 px-4 py-2 rounded flex items-center" style={{ backgroundColor: '#dbdde1', borderColor: '#dbdde1', color: 'rgb(56, 14, 91)', border: '1px solid' }}>
                      <Check size={16} className="mr-2" />
                      <span>Graphic sent successfully to your email!</span>
                    </div>
                  )}
                  
                  {emailError && (
                    <div className="mt-3 px-4 py-2 rounded flex items-center" style={{ backgroundColor: '#dbdde1', borderColor: '#dbdde1', color: 'rgb(56, 14, 91)', border: '1px solid' }}>
                      <AlertCircle size={16} className="mr-2" />
                      <span>{emailError}</span>
                    </div>
                  )}
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