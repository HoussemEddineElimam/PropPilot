import React from 'react';
import { Property } from '../models/Property';
import { Calendar, Square as SquareFeet, Bed, Bath } from 'lucide-react';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold mb-6">About This Property</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {property.bedrooms && (
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Bed className="text-blue-600 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-800">{property.bedrooms}</span>
            <span className="text-sm text-gray-600">Bedrooms</span>
          </div>
        )}
        
        {property.bathrooms && (
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Bath className="text-blue-600 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-800">{property.bathrooms}</span>
            <span className="text-sm text-gray-600">Bathrooms</span>
          </div>
        )}
        
        {property.livingAreaSqft && (
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <SquareFeet className="text-blue-600 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-800">{property.livingAreaSqft}</span>
            <span className="text-sm text-gray-600">Sq. Ft.</span>
          </div>
        )}
        
        {property.yearBuilt && (
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Calendar className="text-blue-600 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-800">{property.yearBuilt}</span>
            <span className="text-sm text-gray-600">Year Built</span>
          </div>
        )}
      </div>
      
      {/* Property info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800">Property Details</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="font-medium w-32">Type:</span>
              <span className="capitalize">{property.type?.replace(/_/g, ' ') || 'N/A'}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium w-32">Status:</span>
              <span className="capitalize">{property.status || 'N/A'}</span>
            </li>
            {property.leaseTerm && (
              <li className="flex items-center gap-2">
                <span className="font-medium w-32">Lease Term:</span>
                <span className="capitalize">{property.leaseTerm.replace('-', ' ')}</span>
              </li>
            )}
            {property.roomCount && (
              <li className="flex items-center gap-2">
                <span className="font-medium w-32">Total Rooms:</span>
                <span>{property.roomCount}</span>
              </li>
            )}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800">Pricing Information</h3>
          <ul className="space-y-2 text-gray-600">
            {property.sellPrice && (
              <li className="flex items-center gap-2">
                <span className="font-medium w-32">Sale Price:</span>
                <span className="text-blue-600 font-semibold">${property.sellPrice.toLocaleString()}</span>
              </li>
            )}
            {property.rentPrice && (
              <li className="flex items-center gap-2">
                <span className="font-medium w-32">Monthly Rent:</span>
                <span className="text-blue-600 font-semibold">${property.rentPrice.toLocaleString()}/month</span>
              </li>
            )}
            {property.type === "real_estate" && (
              <li className="flex items-center gap-2">
                <span className="font-medium w-32">Est. Taxes:</span>
                <span>${Math.round((property.sellPrice || 0) * 0.05).toLocaleString()}/year</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Description */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-800">Description</h3>
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {property.description || 'No description available for this property.'}
        </p>
      </div>
    </div>
  );
};

export default PropertyInfo;