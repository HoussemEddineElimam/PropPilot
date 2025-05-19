import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, PenTool as Tool } from 'lucide-react';
import MaintenanceRequestService from '../services/MaintenanceRequestService';
import { MaintenanceRequest } from '../models/MaintenanceRequest';
import { Property } from '../models/Property';
import useAuthStore from '../hooks/useAuthStore';
import DropDownField from './dropdown field/DropDownField';
import DashboardSearchbar from './dashboard searchbar/DashboardSearchbar';
interface MaintenanceRequestTabProps {
  properties: Property[];
}
export function MaintenanceRequestTab({ properties }: MaintenanceRequestTabProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<MaintenanceRequest['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      if(user){
      const data = await MaintenanceRequestService.getAllByOwnerId(user?._id);
      setRequests(data);}
      else{
        
        setError('Failed to get current user');
      }
    } catch (err) {
      setError('Failed to load maintenance requests');
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: MaintenanceRequest['status']) => {
    try {
      await MaintenanceRequestService.update(requestId, { status: newStatus });
      await fetchMaintenanceRequests(); 
    } catch (err) {
      console.error('Error updating maintenance request:', err);
    }
  };

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p._id === propertyId)?.name || 'Unknown Property';
  };

  const getStatusIcon = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <Tool className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const filteredRequests = requests
    .filter(request => filterStatus === 'all' || request.status === filterStatus)
    .filter(request => 
      getPropertyName(request.propertyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DashboardSearchbar placeholder='Search requests' value={searchTerm} onChange={setSearchTerm} />
        <DropDownField 
          options={statusOptions} 
          selected={filterStatus} 
          label="Select Status" 
          onChange={(value) => setFilterStatus(value as MaintenanceRequest["status"] | "all")}
        />
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {getPropertyName(request.propertyId)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {request.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Reported: {new Date(request.reportedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                  <span className="ml-2 text-sm font-medium capitalize">
                    {request.status}
                  </span>
                </div>
                <select
                  value={request.status}
                  onChange={(e) => handleStatusUpdate(request._id, e.target.value as MaintenanceRequest['status'])}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No maintenance requests found
          </div>
        )}
      </div>
    </div>
  );
}