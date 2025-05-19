import { useState, useEffect, useRef } from "react";
import { Property } from "../models/Property";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { STORAGE_URL } from "../utils/constants";

interface PropertyGalleryProps {
  property: Property;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ property }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  const images = property?.images?.length ? 
    property.images.map(img => getImageUrl(img)) : 
    [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (modalIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
    };

    if (modalIsOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalIsOpen]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8 overflow-hidden">
      <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Main large image */}
        <div className="col-span-2 md:col-span-1 row-span-2">
          <div 
            className="relative h-96 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openModal(0)}
          >
            <img 
              src={images[0]} 
              alt={`${property.name} - Main View`}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
        </div>
        
        {/* Smaller images grid */}
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index + 1}
            className="relative h-44 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openModal(index + 1)}
          >
            <img 
              src={image} 
              alt={`${property.name} - View ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
        ))}
        
        {/* View all photos button */}
        {images.length > 5 && (
          <button 
            onClick={() => openModal(0)}
            className="absolute bottom-10 right-10 bg-white hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg shadow-md text-sm font-medium text-gray-800"
          >
            View all photos ({images.length})
          </button>
        )}
      </div>

      {/* Fullscreen gallery modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div ref={modalRef} className="w-full h-full relative flex flex-col items-center justify-center">
            {/* Navigation controls */}
            <button 
              onClick={prevImage}
              className="absolute left-4 z-20 p-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 z-20 p-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>
            
            {/* Main image */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={images[selectedImageIndex]} 
                alt={`${property.name} - Gallery View ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Image indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;