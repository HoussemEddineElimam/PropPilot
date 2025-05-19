import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Calendar, TrendingUp, PlusCircleIcon, Cog } from 'lucide-react';
import { PropertyList } from '../components/PropertyList';
import { DynamicPricing } from '../components/DynamicPricing';
import { PropertyForm } from '../components/PropertyForm';
import OccupancyCalendar from '../components/OccupencyCalendar';
import SubmitButton from '../components/submit button/SubmitButton';
import PropertyService from '../services/PropertyService';
import useAuthStore from '../hooks/useAuthStore';
import PropertyDetailsModal from '../components/PropertyModalDetails';
import { Property } from '../models/Property';
import { PropertyModalEdit } from '../components/PropertyModalEdit';
import { MaintenanceRequestTab } from '../components/MaintenanceRequestsTab';

export function OwnerProperties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'properties'; 

  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesData = await PropertyService.getAllPropertiesByOwner(user!._id);
        setProperties(propertiesData);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }); 
  };

  const handleAddProperty = async (formData: FormData) => {
    try {
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const createdProperty = await PropertyService.create(formData);
      const propertyData = await PropertyService.getAllPropertiesByOwner(user._id);
      setProperties(propertyData);
      setIsAddPropertyOpen(false);
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleDeleteProperty = async (propertyId: string): Promise<void> => {
    try {
      await PropertyService.delete(propertyId).then(() => {
        setIsDetailsModalOpen(false);
        setIsEditModalOpen(false);
        setProperties((prev) => prev.filter((property) => property._id !== propertyId));
      });
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  //Handle updating a property
  const handleUpdateProperty = async (propertyId: string, formData: FormData): Promise<void> => {
    try {
      await PropertyService.updateFormData(propertyId, formData).then(() => {
        setIsDetailsModalOpen(false);
        setProperties((prev) => prev.filter((property) => property._id !== propertyId));
      });
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleStatusChange = async (
    propertyId: string,
    newStatus: 'available' | 'rented' | 'sold' | 'inactive' | undefined
  ): Promise<void> => {
    try {
      await PropertyService.update(propertyId, { status: newStatus });
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Property Management
          </h1>
          <SubmitButton onClick={() => setIsAddPropertyOpen(true)}>
            <div className="flex items-center justify-center gap-3">
              <PlusCircleIcon size={28} className="dark:text-gray-100" />
              <span className="font-semibold dark:text-gray-100">Add Property</span>
            </div>
          </SubmitButton>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'properties', label: 'Properties', icon: Building2 },
                { id: 'calendar', label: 'Occupancy Calendar', icon: Calendar },
                { id: 'pricing', label: 'Dynamic Pricing', icon: TrendingUp },
                { id: 'maintenance', label: 'Maintenance Requests', icon: Cog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <tab.icon
                    size={20}
                    className={`mr-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'properties' && (
            <PropertyList
              setIsEditModalOpen={setIsEditModalOpen}
              setIsDetailsModalOpen={setIsDetailsModalOpen}
              handleStatusChange={handleStatusChange}
              loading={loading}
              properties={properties}
              setSelectedProperty={setSelectedProperty}
              error={error}
            />
          )}
          {activeTab === 'calendar' && <OccupancyCalendar />}
          {activeTab === 'pricing' && <DynamicPricing />}
          {activeTab === 'maintenance' && <MaintenanceRequestTab properties={properties} />}
        </div>

        <PropertyForm
          isOpen={isAddPropertyOpen}
          onClose={() => setIsAddPropertyOpen(false)}
          onSubmit={handleAddProperty}
        />

        {isDetailsModalOpen && (
          <PropertyDetailsModal
            handleDeleteProperty={handleDeleteProperty}
            setIsDetailsModalOpen={setIsDetailsModalOpen}
            selectedProperty={selectedProperty}
          />
        )}

        {isEditModalOpen && (
          <PropertyModalEdit
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onDelete={handleDeleteProperty}
            property={selectedProperty!}
            onUpdate={handleUpdateProperty}
          />
        )}
      </div>
    </div>
  );
}