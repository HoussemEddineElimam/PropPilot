import { useState, useEffect } from 'react';
import { GripHorizontal, ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from './Input';
import DropDownField from './dropdown field/DropDownField';
import { Property } from '../models/Property';
import { propertyCategories } from '../utils/data';
import useAuthStore from '../hooks/useAuthStore';

// Interfaces
interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  property?: Property;
}

interface ImageType {
  file?: File;
  url: string;
}

interface SortableImageUploadProps {
  images: ImageType[];
  onChange: (images: ImageType[]) => void;
}

interface State {
  name: string;
  state_code: string;
}

interface City {
  name: string;
}

// Constants
const propertyTypeOptions = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'rented_real_estate', label: 'Rented Real Estate' },
  { value: 'hotel', label: 'Hotel' }
];

const propertyStatusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'sold', label: 'Sold' },
  { value: 'inactive', label: 'Inactive' }
];

const leaseTermOptions = [
  { value: 'short-term', label: 'Short Term' },
  { value: 'long-term', label: 'Long Term' }
];

const countries = [
  { value: 'USA', label: 'United States' },
];

function SortableImageUpload({ images, onChange }: SortableImageUploadProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    onChange([...images, ...newImages]);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggingIndex];
    newImages.splice(draggingIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onChange(newImages);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
              draggingIndex === index ? "opacity-50" : ""
            )}
          >
            <img
              src={typeof image === 'string' ? image : image.url}
              className="w-full h-24 object-cover"
              alt={`Property image ${index + 1}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <GripHorizontal className="text-white" size={20} />
            </div>
            <button
              type="button"
              onClick={() => {
                const newImages = [...images];
                newImages.splice(index, 1);
                onChange(newImages);
              }}
              className="absolute top-1 right-1 p-1 bg-red-500 dark:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer flex items-center justify-center transition-colors duration-200">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
            <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Add Images
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}

// PropertyForm Component
export function PropertyForm({ isOpen, onClose, onSubmit, property }: PropertyFormProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [states, setStates] = useState<{ value: string, label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string, label: string }[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { user } = useAuthStore();
  
  const [data, setData] = useState<Omit<Property, '_id' | 'createdAt' | 'updatedAt'>>(property || {
    name: '',
    description: '',
    country: 'USA',
    state: '',
    city: '',
    ownerId: user?._id || '',
    images: [],
    status: "available",
    type: "real_estate",
    category: '',
    sellPrice: undefined,
    rentPrice: undefined,
    leaseTerm: undefined,
    roomCount: undefined,
    bathrooms: undefined,
    bedrooms: undefined,
    yearBuilt: undefined,
    livingAreaSqft: undefined,
    propertyTaxRate: undefined,
    ownerName: user?.fullName || '',
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  });

  useEffect(() => {
    if (property?.images) {
      setImages(property.images.map(url => ({ url })));
    }
  }, [property]);

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch('/usa_states.json');
        if (!response.ok) throw new Error('Failed to fetch states');
        const statesData = await response.json();
        
        setStates(statesData.map((state: State) => ({
          value: state.state_code,
          label: state.name
        })));
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    if (data.country === 'USA') {
      fetchStates();
    } else {
      setStates([]);
      setCities([]);
    }
  }, [data.country]);

  useEffect(() => {
    if (!data.state || data.country !== 'USA') {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const response = await fetch('/usa_states.json');
        if (!response.ok) throw new Error('Failed to fetch states data');
        const statesData = await response.json();
        
        const selectedState = statesData.find((state: State) => state.state_code === data.state);
        if (!selectedState?.cities) {
          setCities([]);
          return;
        }
        
        setCities(selectedState.cities.map((city: City) => ({
          value: city.name,
          label: city.name
        })));
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [data.state, data.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all data fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "images") {
        if (value instanceof Date) {
          formData.set(key, value.toISOString());
        } else if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.set(key, String(value));
        }
      }
    });

    if (!property) {
      formData.set("ownerId", user?._id || '');
      formData.set("ownerName", user?.fullName || '');
    }

    // Append images
    images.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    onSubmit(formData).then(() => {
    //   setImages([]);
    //   setData({
    //     name: '',
    //     description: '',
    //     country: 'USA',
    //     state: '',
    //     city: '', 
    //     ownerId: user?._id || '',
    //     images: [],
    //     status: "available",
    //     type: "real_estate",
    //     category: '',
    //     sellPrice: undefined,
    //     rentPrice: undefined,
    //     leaseTerm: undefined,
    //     roomCount: undefined,
    //     bathrooms: undefined,
    //     bedrooms: undefined,
    //     yearBuilt: undefined,
    //     livingAreaSqft: undefined,
    //     propertyTaxRate: undefined,
    //     ownerName: user?.fullName || '',
    //     transactionIds: [],
    //     maintenanceRequestIds: [],
    //     leaseIds: [],
    //     bookingIds: []
    //   });
    });
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Basic Information
              </h3>
              
              <FormField label="Property Name">
                <Input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  placeholder="Enter property name"
                  required
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400",
                    "transition-colors duration-200"
                  )}
                  rows={4}
                  placeholder="Enter property description"
                />
              </FormField>
            </div>

            {/* Location Section */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Location Information
              </h3>
              
              <FormField label="Country">
                <DropDownField
                  options={countries}
                  selected={data.country}
                  onChange={(value: string) => setData({ ...data, country: value, state: '', city: '' })}
                  label="Select country"
                  disabled
                />
              </FormField>

              {data.country === 'USA' && (
                <>
                  <FormField label="State">
                    <DropDownField
                      options={states}
                      selected={data.state}
                      onChange={(value: string) => setData({ ...data, state: value, city: '' })}
                      label={isLoadingStates ? "Loading states..." : "Select state"}
                      disabled={isLoadingStates}
                    />
                  </FormField>

                  <FormField label="City">
                    <DropDownField
                      options={cities}
                      selected={data.city}
                      onChange={(value: string) => setData({ ...data, city: value })}
                      label={data.state ? (isLoadingCities ? "Loading cities..." : "Select city") : "Please select a state first"}
                      disabled={!data.state || isLoadingCities}
                    />
                  </FormField>
                </>
              )}

              {data.country !== 'USA' && (
                <>
                  <FormField label="State/Province">
                    <Input
                      type="text"
                      name="state"
                      value={data.state}
                      onChange={handleInputChange}
                      placeholder="Enter state or province"
                    />
                  </FormField>

                  <FormField label="City">
                    <Input
                      type="text"
                      name="city"
                      value={data.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </FormField>
                </>
              )}
            </div>

            {/* Property Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Property Details
              </h3>
              
              <FormField label="Property Type">
                <DropDownField
                  options={propertyTypeOptions}
                  selected={data.type}
                  onChange={(value) => setData({ ...data, type: value as "real_estate" | "rented_real_estate" | "hotel" })}
                  label="Select property type"
                  
                />
              </FormField>

              <FormField label="Property Status">
                <DropDownField
                  options={propertyStatusOptions}
                  selected={data.status}
                  onChange={(value: string) => setData({ ...data, status: value as Property['status'] })}
                  label="Select status"
                  
                />
              </FormField>

              <FormField label="Category">
                <DropDownField
                  options={propertyCategories.map(category => ({ value: category.id, label: category.name }))}
                  selected={data.category}
                  label="Select category"
                  onChange={(value: string) => setData({ ...data, category: value })}
                />
              </FormField>

              <FormField label="Year Built">
                <Input
                  type="number"
                  name="yearBuilt"
                  value={data.yearBuilt || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter year built"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </FormField>

              <FormField label="Living Area (sqft)">
                <Input
                  type="number"
                  name="livingAreaSqft"
                  value={data.livingAreaSqft || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter living area"
                  min="0"
                />
              </FormField>

              <FormField label="Property Tax Rate (%)">
                <Input
                  type="number"
                  name="propertyTaxRate"
                  value={data.propertyTaxRate || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter tax rate"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </FormField>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Pricing Information
              </h3>
              
              <FormField label="Sell Price ($)">
                <Input
                  type="number"
                  name="sellPrice"
                  value={data.sellPrice || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter sell price"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField label="Rent Price ($)">
                <Input
                  type="number"
                  name="rentPrice"
                  value={data.rentPrice || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter rent price"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField label="Lease Term">
                <DropDownField
                  options={leaseTermOptions}
                  label='Select lease term'
                  selected={data.leaseTerm}
                  onChange={(value: string) => setData({ ...data, leaseTerm: value as Property['leaseTerm'] })}
                />
              </FormField>
            </div>

            {/* Room Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Room Information
              </h3>
              
              <FormField label="Bedrooms">
                <Input
                  type="number"
                  name="bedrooms"
                  value={data.bedrooms || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter bedroom count"
                  min="0"
                />
              </FormField>

              <FormField label="Bathrooms">
                <Input
                  type="number"
                  name="bathrooms"
                  value={data.bathrooms || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter bathroom count"
                  min="0"
                  step="0.5"
                />
              </FormField>

              <FormField label="Total Rooms">
                <Input
                  type="number"
                  name="roomCount"
                  value={data.roomCount || ''}
                  onChange={handleNumberInputChange}
                  placeholder="Enter total room count"
                  min="0"
                />
              </FormField>
            </div>

            {/* Images Section */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                Property Images
              </h3>
              
              <FormField label="Upload Images">
                <SortableImageUpload
                  images={images}
                  onChange={setImages}
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              {property ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}