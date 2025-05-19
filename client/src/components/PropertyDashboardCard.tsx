import { useEffect, useState, memo, useCallback } from "react";
import { Property } from "../models/Property";
import { Edit2, Eye } from "lucide-react";
import { STORAGE_URL } from "../utils/constants";
import DropDownField from "./dropdown field/DropDownField";
import UserService from "../services/UserService";
import User from "../models/User";
import PropertyDashboardCardSkeleton from "./PropertyDashboardCardSkeleton";

const statusStyles: { [key in "available" | "rented" | "sold" | "inactive"]: string } = {
  available: "bg-green-100 text-green-800",
  rented: "bg-blue-100 text-blue-800",
  sold: "bg-purple-100 text-purple-800",
  inactive: "bg-gray-100 text-gray-800",
};

const ImageGallery = memo(({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative">
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={`${STORAGE_URL}${images[currentImage]}`}
          alt="Property"
          className="w-full h-full object-cover transition-opacity duration-700 opacity-100"
          loading="lazy"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm dark:bg-opacity-70">
          {currentImage + 1} / {images.length}
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 px-6 mt-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentImage === index
                  ? 'bg-blue-500 dark:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

const PropertyDashboardCard = memo(({
  property,
  handleStatusChange,
  setSelectedProperty,
  setIsDetailsModalOpen,
  editable,
  setIsEditModalOpen,
}: {
  property: Property;
  handleStatusChange: (propertyId: string, newStatus: Property["status"]) => void;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  setIsDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  editable: boolean;
}) => {
  const options = [
    { value: "available", label: "Available" },
    { value: "rented", label: "Rented" },
    { value: "sold", label: "Sold" },
    { value: "inactive", label: "Inactive" },
  ];
  
  const [owner, setOwner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOwner = async () => {
      try {
        const user = await UserService.get(property.ownerId);
        if (isMounted) {
          setOwner(user);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOwner();

    return () => {
      isMounted = false;
    };
  }, [property.ownerId]);

  const handleViewClick = useCallback(() => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  }, [property, setSelectedProperty, setIsDetailsModalOpen]);

  const handleEditClick = useCallback(() => {
    if (setIsEditModalOpen) {
      setSelectedProperty(property);
      setIsEditModalOpen(true);
    }
  }, [property, setSelectedProperty, setIsEditModalOpen]);

  const handleStatusUpdate = useCallback((value: string) => {
    handleStatusChange(property._id, value as Property["status"]);
  }, [property._id, handleStatusChange]);

  if (isLoading) return <PropertyDashboardCardSkeleton />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/*Image Gallery Section */}
      <div className="relative">
        <ImageGallery images={property.images ?? []} />
        
        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[property.status ?? "inactive"]}`}>
          {property.status
            ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
            : "Unknown"}
        </span>
      </div>

      {/*Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{`${property.country}, ${property.state}, ${property.city}`}</p>

        {/*Owner */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
            {owner?.avatar ? (
              <img 
                src={owner.avatar.startsWith('http') ? owner.avatar : `${STORAGE_URL}${owner.avatar}`}
                className="w-full h-full rounded-full object-cover"
                alt=""
                loading="lazy"
              />
            ) : owner?.fullName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{owner?.fullName}</span>
        </div>

        {/*Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
            {property.type ? property.type.replace("_", " ") : ""}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
            {property.category}
          </span>
        </div>

        {/*Pricing */}
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
          {property.sellPrice ? `$${property.sellPrice.toLocaleString()}` :
          property.rentPrice ? `$${property.rentPrice.toLocaleString()}/month` : 
          "Price on request"}
        </p>

        {/*Actions */}
        <div className="flex items-center justify-between gap-2">
          <DropDownField
            options={options}
            selected={property.status}
            label="Select Status"
            small
            menuPosition="top"
            onChange={handleStatusUpdate}
          />
          <div className="flex gap-2">
            <button
              onClick={handleViewClick}
              aria-label="View Property"
              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
            
            {editable && setIsEditModalOpen && (
              <button
                onClick={handleEditClick}
                aria-label="Edit Property"
                className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PropertyDashboardCard.displayName = 'PropertyDashboardCard';

export default PropertyDashboardCard;