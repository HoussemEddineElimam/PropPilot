import { useEffect, useState, useCallback } from "react";
import { Trash, X, User } from "lucide-react";
import { Property } from "../models/Property";
import { STORAGE_URL } from "../utils/constants";
import UserService from "../services/UserService";
import UserModel from "../models/User";

interface PropertyDetailsModalProps {
  selectedProperty: Property | null;
  setIsDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteProperty: (propertyId: string) => Promise<void>;
}

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => (
  <div>
    <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
      <img
        src={`${STORAGE_URL}${images[0]}`}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="grid grid-cols-3 gap-2">
      {images.slice(1).map((image, index) => (
        <div key={index} className="relative h-20 rounded-lg overflow-hidden">
          <img
            src={`${STORAGE_URL}${image}`}
            alt={`${name} ${index + 2}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
);

const PropertyInfo = ({ property }: { property: Property }) => (
  <div className="space-y-2">
    <p className="text-gray-600 dark:text-gray-400">
      <span className="font-medium">Location:</span> {`${property.country}, ${property.state}, ${property.city}`}
    </p>
    <p className="text-gray-600 dark:text-gray-400">
      <span className="font-medium">Type:</span> {property.type.split('_').join(' ')}
    </p>
    <p className="text-gray-600 dark:text-gray-400">
      <span className="font-medium">Category:</span> {property.category}
    </p>
    <p className="text-gray-600 dark:text-gray-400">
      <span className="font-medium">Status:</span>{' '}
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
        property.status === 'available' ? 'bg-green-100 text-green-800' :
        property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
        property.status === 'sold' ? 'bg-purple-100 text-purple-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
      </span>
    </p>
    {property.roomCount && (
      <p className="text-gray-600 dark:text-gray-400">
        <span className="font-medium">Rooms:</span> {property.roomCount}
      </p>
    )}
    {property.leaseTerm && (
      <p className="text-gray-600 dark:text-gray-400">
        <span className="font-medium">Lease Term:</span> {property.leaseTerm}
      </p>
    )}
  </div>
);

const PricingInfo = ({ property }: { property: Property }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Pricing</h3>
    {property.sellPrice && (
      <p className="text-blue-600 dark:text-blue-400 text-xl font-bold">
        ${property.sellPrice.toLocaleString()}
      </p>
    )}
    {property.rentPrice && (
      <p className="text-blue-600 dark:text-blue-400 text-xl font-bold">
        ${property.rentPrice.toLocaleString()}/month
      </p>
    )}
    {!property.sellPrice && !property.rentPrice && (
      <p className="text-gray-600 dark:text-gray-400 italic">
        Price on request
      </p>
    )}
  </div>
);

const OwnerInfo = ({ owner }: { owner: UserModel }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
      {owner.avatar ? (
        <img
          src={owner.avatar.startsWith('http') ? owner.avatar : `${STORAGE_URL}${owner.avatar}`}
          alt={owner.fullName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <User className="w-6 h-6 text-blue-500" />
      )}
    </div>
    <div>
      <p className="font-medium">{owner.fullName}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{owner.email}</p>
    </div>
  </div>
);

export default function PropertyDetailsModal({
  selectedProperty,
  setIsDetailsModalOpen,
  handleDeleteProperty
}: PropertyDetailsModalProps) {
  const [owner, setOwner] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOwner = async () => {
      if (!selectedProperty) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const ownerData = await UserService.get(selectedProperty.ownerId);
        if (isMounted) {
          setOwner(ownerData);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load owner information');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOwner();

    return () => {
      isMounted = false;
    };
  }, [selectedProperty]);

  const handleClose = useCallback(() => {
    setIsDetailsModalOpen(false);
  }, [setIsDetailsModalOpen]);

  const handleDelete = useCallback(async () => {
    if (!selectedProperty) return;
    
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await handleDeleteProperty(selectedProperty._id);
        handleClose();
      } catch (err) {
        console.error('Failed to delete property:', err);
      }
    }
  }, [selectedProperty, handleDeleteProperty, handleClose]);

  if (!selectedProperty) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/*Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{selectedProperty.name}</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*Left Column - Images */}
            <ImageGallery images={selectedProperty.images} name={selectedProperty.name} />

            {/*Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Property Details</h3>
                <PropertyInfo property={selectedProperty} />
              </div>

              <PricingInfo property={selectedProperty} />

              <div>
                <h3 className="text-lg font-semibold mb-2">Owner Information</h3>
                {isLoading ? (
                  <div className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                    </div>
                  </div>
                ) : error ? (
                  <p className="text-red-500 dark:text-red-400">{error}</p>
                ) : owner ? (
                  <OwnerInfo owner={owner} />
                ) : null}
              </div>

              {/*Delete Button */}
              <div className="pt-4 border-t dark:border-gray-700">
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Delete Property"
                >
                  <Trash className="w-5 h-5" />
                  <span>Delete Property</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}