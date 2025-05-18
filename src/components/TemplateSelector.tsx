import React from 'react';
import { useEventContext } from '../context/EventContext';
import { Check } from 'lucide-react';

const TemplateSelector: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate, templates } = useEventContext();
  
  const handleTemplateSelect = (index: number) => {
    setSelectedTemplate(index);
  };
  
  return (
    <div className="template-selector">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#380e5b]">
          Choose from our professionally designed templates.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`template-card relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              selectedTemplate === index
                ? 'border-[#72edff] shadow-md selected'
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => handleTemplateSelect(index)}
          >
            <div className="relative pt-[100%] bg-gray-100">
              <img
                src={template.imageUrl}
                alt={template.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {selectedTemplate === index && (
                <div className="absolute inset-0 bg-[#72edff] bg-opacity-20 flex items-center justify-center">
                  <div className="absolute top-2 right-2 bg-[#380e5b] text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-2 bg-white">
              <h3 className="text-sm font-medium text-[#380e5b] truncate">
                {template.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-[#380e5b]">
        <p>All templates are optimized for LinkedIn sharing with the perfect dimensions and professional design.</p>
      </div>
    </div>
  );
};

export default TemplateSelector;