import React, { useRef, useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';

const GraphicPreview: React.FC = () => {
  const { userPhoto, userName, selectedTemplate, templates } = useEventContext();
  const graphicRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<string>('2.25rem');
  const [bottomPadding, setBottomPadding] = useState<string>('6rem'); // 24 * 4 = 96px (bottom-24)
  
  // Update font size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize('1.5rem');
        setBottomPadding('3rem'); // 12 * 4 = 48px (half of desktop)
      } else {
        setFontSize('2.25rem');
        setBottomPadding('6rem'); // 24 * 4 = 96px (original)
      }
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const template = templates[selectedTemplate];
  
  return (
    <div className="graphic-preview relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
      <div 
        id="graphic-preview"
        ref={graphicRef}
        className="relative"
        style={{ 
          width: '600px', 
          height: '600px',
          maxWidth: '100%',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {template && (
          <div 
            className="absolute inset-0"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundImage: `url(${template.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        )}
        
        {userPhoto && (
          <div
            className="profile-container"
            style={{
              position: 'absolute', 
              left: '50%', 
              top: '50%',
              transform: 'translate(-50%, -50%) translateY(-10px)',
              width: '300px',
              height: '300px'
            }}
          >
            <div 
              className="rounded-full overflow-hidden border-[8px] border-white shadow-lg"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              <img
                src={userPhoto}
                alt="Your profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        )}
        
        <div 
          className="absolute left-0 right-0 text-center"
          style={{
            width: '100%',
            padding: '0 20px',
            bottom: bottomPadding
          }}
        >
          <h4 
            className="font-bold text-[#7FE7F3]"
            style={{ fontSize: fontSize }}
          >
            {userName || 'Your Name'}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default GraphicPreview;