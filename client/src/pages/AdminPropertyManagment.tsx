import { useEffect, useMemo, useState } from 'react';
import { Property } from '../models/Property';
import PropertyCard from '../components/PropertyDashboardCard';
import PropertyDetailsModal from '../components/PropertyModalDetails';
import DropDownField from '../components/dropdown field/DropDownField';
import PropertyService from '../services/PropertyService';
import DashboardSearchbar from '../components/dashboard searchbar/DashboardSearchbar';

const AdminPropertyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    getAllProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
      const matchesType = selectedType === 'all' || property.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, searchTerm, selectedStatus, selectedType]);

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'price-high':
        return (b.sellPrice || b.rentPrice || 0) - (a.sellPrice || a.rentPrice || 0);
      case 'price-low':
        return (a.sellPrice || a.rentPrice || 0) - (b.sellPrice || b.rentPrice || 0);
      default:
        return 0;
    }
  });

  const getAllProperties = async (): Promise<void> => {
    try {
      const properties = await PropertyService.getAll();
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  const handleStatusChange = async (propertyId: string, newStatus: "available" | "rented" | "sold" | "inactive" | undefined): Promise<void> => {
    try {
      await PropertyService.update(propertyId,{status:newStatus});


    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };
  

  const handleDeleteProperty = async (propertyId: string): Promise<void> => {
    try {
      await PropertyService.delete(propertyId).then(()=>{setIsDetailsModalOpen(false);setProperties(prev => prev.filter(property => property._id !== propertyId));});
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Property Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <DashboardSearchbar value={searchTerm} onChange={setSearchTerm} placeholder='Search Properties'/>

        <DropDownField label="Status" options={[
          { label: "All Statuses", value: "all" },
          { label: "Available", value: "available" },
          { label: "Rented", value: "rented" },
          { label: "Sold", value: "sold" },
          { label: "Inactive", value: "inactive" },
        ]} selected={selectedStatus} onChange={setSelectedStatus} />

        <DropDownField label="Type" options={[
          { label: "All Types", value: "all" },
          { label: "Real Estate", value: "real_estate" },
          { label: "Rented Real Estate", value: "rented_real_estate" },
          { label: "Hotel", value: "hotel" },
        ]} selected={selectedType} onChange={setSelectedType} />

        <DropDownField label="Sort By" options={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
          { label: "Price: High to Low", value: "price-high" },
          { label: "Price: Low to High", value: "price-low" },
        ]} selected={sortBy} onChange={setSortBy} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            setIsDetailsModalOpen={setIsDetailsModalOpen}
            setSelectedProperty={setSelectedProperty}
            editable={false}
            handleStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {isDetailsModalOpen && <PropertyDetailsModal handleDeleteProperty={handleDeleteProperty} setIsDetailsModalOpen={setIsDetailsModalOpen} selectedProperty={selectedProperty} />}
    </div>
  );
};

export default AdminPropertyManagement;
