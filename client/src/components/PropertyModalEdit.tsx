import { useState } from 'react';
import { GripHorizontal, ImageIcon, X, Trash } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from './Input';
import DropDownField from './dropdown field/DropDownField';
import { Property } from '../models/Property';
import { propertyCategories } from '../utils/data';
import { STORAGE_URL } from '../utils/constants';

interface PropertyModalEditProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (propertyId:string,data: FormData) => Promise<void>;
  onDelete: (propertyId: string) => Promise<void>;
}

interface ImageType {
  file?: File;
  url: string;
}

interface SortableImageUploadProps {
  images: ImageType[];
  onChange: (images: ImageType[]) => void;
  existingImages?: string[];
}

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

function SortableImageUpload({ images, onChange, existingImages = [] }: SortableImageUploadProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    onChange([...images, ...newImages]);
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {existingImages.map((image, index) => (
          <div
            key={`existing-${index}`}
            className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <img
              src={`${STORAGE_URL}${image}`}
              alt={`Existing image ${index + 1}`}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">Existing</span>
            </div>
          </div>
        ))}
        {images.map((image, index) => (
          <div
            key={`new-${index}`}
            draggable
            onDragOver={(e) => handleDragOver(e, index)}
            className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <img
              src={image.url}
              alt={`New image ${index + 1}`}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <GripHorizontal className="text-white" size={20} />
            </div>
            <button
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

export function PropertyModalEdit({ property, isOpen, onClose, onUpdate, onDelete }: PropertyModalEditProps) {
  const [formData, setFormData] = useState<Property>(property);
  const [newImages, setNewImages] = useState<ImageType[]>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();

    //Add all property fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && key !== "images") {
        submitData.set(key, value as string | Blob);
      }
    });

    //Add new images
    newImages.forEach((image) => {
      if (image.file) {
        submitData.append('images', image.file);
      }
    });

    await onUpdate(property._id,submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Property: {property.name}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onDelete(property._id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Trash size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Property Name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter property name"
              />
            </FormField>

            <FormField label="Country">
              <Input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter property country"
              />
            </FormField>
            <FormField label="State">
              <Input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter property state"
              />
            </FormField>
            <FormField label="City">
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter property city"
              />
            </FormField>

            <FormField label="Property Type">
              <DropDownField
                options={propertyTypeOptions}
                selected={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as Property['type'] })}
              />
            </FormField>

            <FormField label="Property Status">
              <DropDownField
                options={propertyStatusOptions}
                selected={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value as Property['status'] })}
              />
            </FormField>

            <FormField label="Category">
              <DropDownField
                options={propertyCategories.map(category => ({ value: category.id, label: category.name }))}
                selected={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
              />
            </FormField>

            <FormField label="Room Count">
              <Input
                type="number"
                value={formData.roomCount || ''}
                onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) })}
                placeholder="Enter room count"
              />
            </FormField>

            <FormField label="Sell Price">
              <Input
                type="number"
                value={formData.sellPrice || ''}
                onChange={(e) => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) })}
                placeholder="Enter sell price"
              />
            </FormField>

            <FormField label="Rent Price">
              <Input
                type="number"
                value={formData.rentPrice || ''}
                onChange={(e) => setFormData({ ...formData, rentPrice: parseFloat(e.target.value) })}
                placeholder="Enter rent price"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(
                "w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400",
                "transition-colors duration-200"
              )}
              rows={4}
              placeholder="Enter property description"
            />
          </FormField>

          <FormField label="Images">
            <SortableImageUpload
              images={newImages}
              onChange={setNewImages}
              existingImages={property.images}
            />
          </FormField>

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
              Save Changes
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