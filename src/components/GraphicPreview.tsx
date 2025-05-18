import React, { useRef } from 'react';
import { useEventContext } from '../context/EventContext';

const GraphicPreview: React.FC = () => {
  const { userPhoto, userName, selectedTemplate, templates } = useEventContext();
  const graphicRef = useRef<HTMLDivElement>(null);
  
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
          className="absolute bottom-24 left-0 right-0 text-center"
          style={{
            width: '100%',
            padding: '0 20px'
          }}
        >
          <h4 className="text-4xl font-bold text-[#7FE7F3]">{userName || 'Your Name'}</h4>
        </div>
      </div>
    </div>
  );
};

export default GraphicPreview;