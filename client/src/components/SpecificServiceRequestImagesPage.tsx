import React, { useState } from 'react';
import { Card } from './Card';
import { ChevronLeft, ChevronRight, Play } from './icons';
import { ServiceRequestMedia } from '../types';

interface SpecificServiceRequestImagesPageProps {
  media: ServiceRequestMedia[];
}

export const SpecificServiceRequestImagesPage: React.FC<SpecificServiceRequestImagesPageProps> = ({ media }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) {
    return <Card><p className="text-center text-text-secondary">No images or videos available for this request.</p></Card>;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };
  
  const activeMedia = media[activeIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Viewer */}
      <div className="flex-grow lg:w-2/3">
        <Card className="p-4 h-full flex flex-col">
          <div className="relative flex-grow bg-gray-100 rounded-xl flex items-center justify-center aspect-[4/3]">
            <img src={activeMedia.url} alt={`Service request media ${activeIndex + 1}`} className="max-h-full max-w-full object-contain rounded-lg" />

            {activeMedia.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer">
                <div className="bg-white/30 p-4 rounded-full backdrop-blur-sm">
                  <Play className="w-12 h-12 text-white" fill="white" />
                </div>
              </div>
            )}
            
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400">
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className="flex justify-center items-center mt-4 space-x-2">
            {media.map((_, index) => (
              <button key={index} onClick={() => setActiveIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-purple-400 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to image ${index + 1}`}></button>
            ))}
          </div>
        </Card>
      </div>

      {/* Thumbnail Gallery */}
      <div className="lg:w-1/3">
        <Card className="p-4 h-full">
            <div className="grid grid-cols-2 gap-4">
                {media.map((item, index) => (
                    <button key={index} onClick={() => setActiveIndex(index)} className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 ${activeIndex === index ? 'ring-2 ring-purple-400 ring-offset-2' : 'ring-0'}`}>
                        <img src={item.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                <Play className="w-6 h-6 text-white" fill="white"/>
                            </div>
                        )}
                         <div className={`absolute inset-0 bg-white transition-opacity duration-200 ${activeIndex === index ? 'opacity-0' : 'opacity-20 hover:opacity-0'}`}></div>
                    </button>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};