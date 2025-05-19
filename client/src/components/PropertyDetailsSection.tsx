import { FaTv, FaPhone, FaDesktop, FaFire, FaBed, FaBath, FaRulerCombined, FaCalendarAlt, FaHome, FaMoneyBillWave, FaKey } from 'react-icons/fa';
import { MdKitchen, MdCoffee, MdDining, MdLocalLaundryService } from 'react-icons/md';
import { GiIronMask, GiHanger, GiHouse } from 'react-icons/gi';
import { Property } from '../models/Property';

interface PropertyDetailsSectionProps {
  property: Property | null;
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({ property }) => {
  // Property basic info
  const propertyName = property?.name || "Loading...";
  const location = property ? `${property.city}, ${property.state}` : "Loading...";
  const description = property?.description || "No description available";

  // Property features
  const roomCount = property?.roomCount || 0;
  const bathrooms = property?.bathrooms || 0;
  const bedrooms = property?.bedrooms || 0;
  const livingAreaSqft = property?.livingAreaSqft || 0;
  const yearBuilt = property?.yearBuilt;
  const propertyType = property?.type ? property.type.replace(/_/g, ' ') : '';
  const leaseTerm = property?.leaseTerm ? property.leaseTerm.replace('-', ' ') : '';
  const status = property?.status || '';

  // Pricing info
  const sellPrice = property?.sellPrice;
  const rentPrice = property?.rentPrice;

  // Basic features display
  const basicFeatures = [
    { icon: <FaBed className="text-xl" />, label: `${bedrooms} Bedrooms`, value: bedrooms },
    { icon: <FaBath className="text-xl" />, label: `${bathrooms} Bathrooms`, value: bathrooms },
    { icon: <FaRulerCombined className="text-xl" />, label: `${livingAreaSqft} sq.ft`, value: livingAreaSqft },
    ...(roomCount ? [{ icon: <GiHouse className="text-xl" />, label: `${roomCount} Rooms`, value: roomCount }] : []),
    ...(yearBuilt ? [{ icon: <FaCalendarAlt className="text-xl" />, label: `Year Built: ${yearBuilt}`, value: yearBuilt }] : []),
  ];

  // Property amenities
  const amenities = [
    { icon: <FaTv className="text-xl" />, label: "TV" },
    { icon: <MdKitchen className="text-xl" />, label: "Kitchen" },
    { icon: <MdLocalLaundryService className="text-xl" />, label: "Washing Machine" },
    { icon: <FaDesktop className="text-xl" />, label: "Work Desk" },
    { icon: <MdCoffee className="text-xl" />, label: "Coffee Machine" },
    { icon: <MdDining className="text-xl" />, label: "Dishes" },
    { icon: <GiIronMask className="text-xl" />, label: "Iron" },
    { icon: <GiHanger className="text-xl" />, label: "Wardrobe" },
    { icon: <FaPhone className="text-xl" />, label: "Phone" },
    { icon: <FaFire className="text-xl" />, label: "Fireplace" },
  ];

  return (
    <div className="space-y-8">
      {/* Property Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{propertyName}</h1>
        <p className="text-gray-600 mb-4">{location}</p>
      </div>

      {/* Basic Features */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Property Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {basicFeatures.filter(feat => feat.value).map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Information */}
      {(sellPrice || rentPrice) && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          <div className="flex flex-wrap gap-4">
            {sellPrice && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FaMoneyBillWave className="text-xl text-blue-600" />
                <div>
                  <p className="font-semibold">Sale Price</p>
                  <p>${sellPrice.toLocaleString()}</p>
                </div>
              </div>
            )}
            {rentPrice && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FaKey className="text-xl text-green-600" />
                <div>
                  <p className="font-semibold">Rent Price</p>
                  <p>${rentPrice.toLocaleString()}/mo</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Property Description */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </section>

      {/* Property Type and Status */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Property Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {propertyType && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaHome className="text-xl" />
              <span>Type: {propertyType}</span>
            </div>
          )}
          {status && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaKey className="text-xl" />
              <span>Status: {status}</span>
            </div>
          )}
          {leaseTerm && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCalendarAlt className="text-xl" />
              <span>Lease: {leaseTerm}</span>
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{amenity.icon}</span>
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailsSection;