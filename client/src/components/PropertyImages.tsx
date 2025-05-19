import { useState, useEffect, useRef } from "react";
import { Property } from "../models/Property";
import { STORAGE_URL } from "../utils/constants";

interface PropertyImagesProps {
  property: Property | null;
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ property }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage('');
    document.body.style.overflow = 'auto';
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
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (modalIsOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalIsOpen]);

  const placeholderImages = [
    "https://via.placeholder.com/800x600?text=No+Image+Available",
    "https://via.placeholder.com/800x600?text=No+Image+Available",
    "https://via.placeholder.com/800x600?text=No+Image+Available"
  ];

  const images = property?.images?.length ? property.images.map((e)=>STORAGE_URL+e) : placeholderImages;

  return (
    <div>
      <div className="flex overflow-x-auto gap-4 mb-8">
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <img 
              src={image}
              alt={`Property view ${index + 1}`} 
              className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(image)}
            />
          </div>
        ))}
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div ref={modalRef} className="relative max-w-4xl max-h-4xl">
            <button 
              onClick={closeModal} 
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-25 text-white text-2xl hover:bg-opacity-50 focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Selected property view" 
              className="max-w-full max-h-[80vh] rounded-lg" 
            />
          </div>
        </div>
      )}
    </div>
  );
};