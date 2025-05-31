import React, { useState, useEffect } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import TemplateSelector from '../components/TemplateSelector';
import GraphicPreview from '../components/GraphicPreview';
import UserForm from '../components/UserForm';
import { useEventContext } from '../context/EventContext';
import { Download, ArrowLeft, ArrowRight, Mail, Check, AlertCircle, Film } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sendGraphicByEmail } from '../utils/emailUtils';
import { createAnimatedGif } from '../utils/gifUtils';

const Generator: React.FC = () => {
  const { userPhoto, userName, userEmail, selectedTemplate, templates } = useEventContext();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isGeneratingGif, setIsGeneratingGif] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);
  const [gifPreviewUrl, setGifPreviewUrl] = useState<string | null>(null);
  
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
  
  // Generate and download the image
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
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate and download animated GIF
  const handleAnimatedGifDownload = async () => {
    setIsGeneratingGif(true);
    setGifProgress(0);
    setGifPreviewUrl(null); // Clear any previous preview
    
    try {
      console.log('Starting animated GIF generation');
      
      // Get the current template content
      const previewElement = document.getElementById('graphic-preview');
      if (!previewElement) {
        throw new Error('Preview element not found');
      }
      
      // Create a hidden render element for the GIF frames
      const renderElement = document.createElement('div');
      renderElement.style.position = 'absolute';
      renderElement.style.left = '-9999px';
      renderElement.style.top = '-9999px';
      renderElement.style.width = '1080px';
      renderElement.style.height = '1080px';
      document.body.appendChild(renderElement);
      
      // Get the selected template
      const template = selectedTemplate !== -1 ? templates[selectedTemplate] : null;
      if (!template) {
        throw new Error('No template selected');
      }
      
      // Create a complete render element from scratch to ensure proper styling
      // Background
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
      
      // Profile image with ring
      if (userPhoto) {
        const profileContainer = document.createElement('div');
        profileContainer.style.position = 'absolute';
        profileContainer.style.left = '50%';
        profileContainer.style.top = '50%';
        profileContainer.style.transform = 'translate(-50%, -50%) translateY(-10px)';
        profileContainer.style.width = '540px';
        profileContainer.style.height = '540px';
        
        const profileRing = document.createElement('div');
        profileRing.id = 'animated-profile-ring';
        profileRing.className = 'profile-ring animated-ring';
        profileRing.setAttribute('data-is-ring', 'true');
        profileRing.style.width = '100%';
        profileRing.style.height = '100%';
        profileRing.style.borderRadius = '50%';
        profileRing.style.overflow = 'hidden';
        profileRing.style.border = `16px solid ${template.primaryColor}`;
        profileRing.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        const profileImg = document.createElement('img');
        profileImg.src = userPhoto;
        profileImg.style.width = '100%';
        profileImg.style.height = '100%';
        profileImg.style.objectFit = 'cover';
        
        // Ensure image is loaded
        await new Promise((resolve) => {
          if (profileImg.complete) {
            resolve(null);
          } else {
            profileImg.onload = () => resolve(null);
            profileImg.onerror = () => resolve(null);
          }
        });
        
        profileRing.appendChild(profileImg);
        profileContainer.appendChild(profileRing);
        renderElement.appendChild(profileContainer);
      }
      
      // Name text - positioned 50px higher than before
      const nameContainer = document.createElement('div');
      nameContainer.style.position = 'absolute';
      nameContainer.style.left = '0';
      nameContainer.style.right = '0';
      nameContainer.style.width = '100%';
      nameContainer.style.textAlign = 'center';
      nameContainer.style.padding = '0 20px';
      nameContainer.style.bottom = 'calc(6rem + 110px)'; // Move up by 110px from the original position (moved down 15px from previous)
      
      const nameText = document.createElement('h2'); // Restore to h2 as originally used
      nameText.innerText = userName || 'Your Name';
      nameText.style.fontSize = '55px'; // Increased to 55px as requested
      nameText.style.fontWeight = 'bold';
      nameText.style.color = template.textColor;
      
      nameContainer.appendChild(nameText);
      renderElement.appendChild(nameContainer);
      
      console.log('Render element prepared, starting GIF generation');
      
      // Create animated GIF with progress tracking
      const gifBlob = await createAnimatedGif(
        renderElement,
        userName,
        (progress) => {
          console.log(`GIF progress: ${Math.round(progress * 100)}%`);
          setGifProgress(Math.round(progress * 100));
        }
      );
      
      console.log('GIF generation complete, creating preview');
      
      // Create a URL for the preview
      const previewUrl = URL.createObjectURL(gifBlob);
      setGifPreviewUrl(previewUrl);
      
      // Download the GIF
      const link = document.createElement('a');
      link.download = `dx-excellence-animated-${userName || 'graphic'}.gif`;
      link.href = previewUrl;
      link.click();
      
      // Clean up
      document.body.removeChild(renderElement);
      
      console.log('Animated GIF created and downloaded successfully');
    } catch (error) {
      console.error('Error generating animated GIF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`There was an error generating the animated GIF: ${errorMessage}. Please try again.`);
    } finally {
      setIsGeneratingGif(false);
    }
  };
  
  const canProceedToStep2 = !!userPhoto;
  const canProceedToStep3 = !!userName && !!userEmail;
  const canProceedToStep4 = selectedTemplate !== -1;
  // Used for disabling the download buttons
  const isDownloadReady = userPhoto && userName && userEmail && selectedTemplate !== -1;
  
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
                  
                  <div className="flex flex-col gap-3 w-full">
                    {/* Download & Send Email Button */}
                    <button
                      onClick={handleDownload}
                      disabled={isGenerating || isEmailSending || isGeneratingGif}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all ${selectedTemplate !== -1 && templates[selectedTemplate]?.primaryColor === '#380e5b' ? 'bg-[#380e5b] hover:bg-[#4a1276]' : 'bg-[#72edff] hover:bg-[#5ad8ea] text-gray-800'}`}
                    >
                      {isGenerating || isEmailSending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <span>{isEmailSending ? 'Sending Email...' : 'Generating...'}</span>
                        </div>
                      ) : (
                        <>
                          {userEmail ? <Mail size={20} className="mr-1" /> : <Download size={20} />}
                          <span>{userEmail ? 'Download & Send graphic' : 'Download Graphic'}</span>
                        </>
                      )}
                    </button>
                    
                    {/* Animated GIF Button */}
                    <button
                      onClick={handleAnimatedGifDownload}
                      disabled={isGenerating || isEmailSending || isGeneratingGif}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all ${selectedTemplate !== -1 && templates[selectedTemplate]?.primaryColor === '#380e5b' ? 'bg-[#380e5b] hover:bg-[#4a1276]' : 'bg-[#72edff] hover:bg-[#5ad8ea] text-gray-800'}`}
                    >
                      {isGeneratingGif ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <span>Creating GIF... {gifProgress}%</span>
                        </div>
                      ) : (
                        <>
                          <Film size={20} className="mr-1" />
                          <span>Download Animated GIF</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* GIF Preview */}
                  {gifPreviewUrl && (
                    <div className="mt-4 border rounded-lg overflow-hidden" style={{ borderColor: '#dbdde1' }}>
                      <div className="bg-gray-50 px-4 py-2 border-b" style={{ borderColor: '#dbdde1' }}>
                        <h4 className="font-medium text-[#380e5b]">Animated GIF Preview</h4>
                      </div>
                      <div className="p-4 flex justify-center">
                        <img 
                          src={gifPreviewUrl} 
                          alt="Animated GIF Preview" 
                          className="max-w-full rounded shadow-sm" 
                          style={{ maxHeight: '300px' }} 
                        />
                      </div>
                    </div>
                  )}
                  
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