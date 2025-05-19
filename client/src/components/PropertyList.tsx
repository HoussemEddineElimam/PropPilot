import { Property } from '../models/Property';
import PropertyDashboardCard from './PropertyDashboardCard';

export function PropertyList({setSelectedProperty,loading,error,properties,handleStatusChange,setIsEditModalOpen,setIsDetailsModalOpen}:{properties: Property[],setSelectedProperty:React.Dispatch<React.SetStateAction<Property | null>>,
  setIsEditModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
  setIsDetailsModalOpen:React.Dispatch<React.SetStateAction<boolean>>
  handleStatusChange: (propertyId: string, newStatus: "available" | "rented" | "sold" | "inactive" | undefined) => Promise<void>
  error:string|null,loading:boolean}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyDashboardCard key={property._id} property={property} handleStatusChange={handleStatusChange} setIsDetailsModalOpen={setIsDetailsModalOpen}  setIsEditModalOpen={setIsEditModalOpen} editable setSelectedProperty={setSelectedProperty}  />
      ))}
    </div>
  );
}