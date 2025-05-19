import React from 'react';
import { Property } from '../models/Property';
import { 
  Tv, Wifi, Coffee, Utensils, ScrollText, 
  Sparkles, ParkingCircle, Snowflake, Fan,
  ShowerHead, Droplets, Sofa, Music, Phone, Flame
} from 'lucide-react';

interface PropertyAmenitiesProps {
  property: Property;
}

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  const amenities = [
    { icon: <Wifi className="text-blue-600" size={20} />, label: "High-Speed WiFi" },
    { icon: <Tv className="text-blue-600" size={20} />, label: "Smart TV" },
    { icon: <Coffee className="text-blue-600" size={20} />, label: "Coffee Machine" },
    { icon: <Utensils className="text-blue-600" size={20} />, label: "Fully Equipped Kitchen" },
    { icon: <ScrollText className="text-blue-600" size={20} />, label: "Work Desk" },
    { icon: <Sparkles className="text-blue-600" size={20} />, label: "Cleaning Service" },
    { icon: <ParkingCircle className="text-blue-600" size={20} />, label: "Free Parking" },
    { icon: <Snowflake className="text-blue-600" size={20} />, label: "Air Conditioning" },
    { icon: <Fan className="text-blue-600" size={20} />, label: "Ceiling Fans" },
    { icon: <ShowerHead className="text-blue-600" size={20} />, label: "Luxury Bathroom" },
    { icon: <Droplets className="text-blue-600" size={20} />, label: "Washer & Dryer" },
    { icon: <Sofa className="text-blue-600" size={20} />, label: "Comfortable Seating" },
    { icon: <Music className="text-blue-600" size={20} />, label: "Sound System" },
    { icon: <Phone className="text-blue-600" size={20} />, label: "Free Local Calls" },
    { icon: <Flame className="text-blue-600" size={20} />, label: "Fireplace" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold mb-6">Amenities & Features</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
              {amenity.icon}
            </div>
            <span className="text-gray-700">{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;