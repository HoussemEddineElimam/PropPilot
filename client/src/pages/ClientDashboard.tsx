import { useEffect, useState } from "react"
import {
  Home,
  Building,
  Hotel,
  CreditCard,
  Bell,
  ChevronRight,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import BookingService from "../services/BookingService"
import LeaseService from "../services/LeaseService"
import PropertyService from "../services/PropertyService"
import TransactionService from "../services/TransactionService"
import NotificationService from "../services/NotificationService"
import MaintenanceRequestService from "../services/MaintenanceRequestService"
import useAuthStore from "../hooks/useAuthStore"
import { MaintenanceRequest } from "../models/MaintenanceRequest"
import { Notification } from "../models/Notification"
import Transaction from "../models/Transaction"
import { Property } from "../models/Property"
import { Lease } from "../models/Lease"
import { Booking } from "../models/Booking"
import { STORAGE_URL } from "../utils/constants"
import DropDownField from "../components/dropdown field/DropDownField"
import SubmitButton from "../components/submit button/SubmitButton"

function ClientDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    bookings: [] as Booking[],
    leases: [] as Lease[],
    properties: [] as Property[],
    transactions: [] as Transaction[],
    notifications: [] as Notification[],
    maintenanceRequests: [] as MaintenanceRequest[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user?._id) return;

      const [
        bookings,
        leases,
        properties,
        transactions,
        notifications,
        maintenanceRequests
      ] = await Promise.all([
        BookingService.getAll(),
        LeaseService.getAllByClientId(user._id),
        PropertyService.getAll(),
        TransactionService.getAllByUserId(user._id),
        NotificationService.getAll(),
        MaintenanceRequestService.getAll()
      ]);

      setData({
        bookings,
        leases,
        properties,
        transactions,
        notifications,
        maintenanceRequests
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'active':
      case 'resolved':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
      case 'inprogress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'canceled':
      case 'terminated':
      case 'warning':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'real_estate':
        return <Home className="h-5 w-5" />;
      case 'rented_real_estate':
        return <Building className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  const TabButton = ({ tab, label }: { tab: string; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${activeTab === tab
          ? 'bg-[#1F4B43] text-white'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {label}
    </button>
  );

  const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}
    >
      {children}
    </span>
  );

  const Button = ({
    children,
    variant = 'primary',
    size = 'base',
    className = '',
    ...props
  }: {
    children: React.ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'base' | 'lg';
    className?: string;
    [key: string]: any;
  }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
    const variants = {
      primary: 'bg-[#1F4B43] text-white hover:bg-[#183832]',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:bg-gray-100',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      base: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  // Filter data for the overview cards
  const activeLeases = data.leases.filter(l => l.status === 'active');
  const confirmedBookings = data.bookings.filter(b => b.status === 'confirmed');
  const pendingTransactions = data.transactions.filter(t => t.status === 'pending');
  const pendingAmount = pendingTransactions.reduce((acc, curr) => acc + curr.amount, 0);
const [showCreateDialog, setShowCreateDialog] = useState(false);
const [newRequest, setNewRequest] = useState({
  propertyId: '',
  description: ''
});
  return (
    <div className="h-screen bg-gray-50 mt-12">
      <div className="mx-auto w-full p-2 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-500">Manage your properties, bookings, and transactions</p>
        </div>

        <div className="mb-6 flex space-x-2 overflow-x-auto">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="properties" label="Properties" />
          <TabButton tab="bookings" label="Bookings" />
          <TabButton tab="transactions" label="Transactions" />
          <TabButton tab="maintenance" label="Maintenance" />
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">Active Rentals</div>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">
                        {activeLeases.length}
                      </div>
                      <Building className="h-5 w-5 text-[#1F4B43]" />
                    </div>
                  )}
                </div>
                <div className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">Upcoming Bookings</div>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">
                        {confirmedBookings.length}
                      </div>
                      <Calendar className="h-5 w-5 text-[#1F4B43]" />
                    </div>
                  )}
                </div>
                <div className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">Total Properties</div>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">
                        {data.properties.length}
                      </div>
                      <Home className="h-5 w-5 text-[#1F4B43]" />
                    </div>
                  )}
                </div>

                {/* Pending Payments Card */}
                <div className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">Pending Payments</div>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">
                        ${pendingAmount.toLocaleString()}
                      </div>
                      <DollarSign className="h-5 w-5 text-[#1F4B43]" />
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <Button variant="ghost" size="sm">
                    View all
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="mb-1 h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : data.notifications.length > 0 ? (
                    data.notifications.slice(0, 5).map((notification, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="rounded-full bg-gray-100 p-2">
                          {getStatusIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                        </div>
                        <Badge className={getStatusColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg bg-white p-4 shadow">
                    <Skeleton className="mb-4 h-48 w-full rounded-lg" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : data.properties.length > 0 ? (
                data.properties.map((property) => (
                  <div key={property._id} className="rounded-lg bg-white shadow transition-shadow hover:shadow-md">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={STORAGE_URL+property.images[0] as string}
                        alt={property.name}
                        className="h-48 w-full rounded-t-lg object-cover"
                      />
                    ) : (
                      <div className="h-48 w-full rounded-t-lg bg-gray-200 flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{property.name}</h3>
                        {getPropertyTypeIcon(property.type || "")}
                      </div>
                      <p className="mb-4 text-sm text-gray-500">
                        {[property.city, property.state, property.country].filter(Boolean).join(', ')}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(property.status || "")}>
                          {property.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500">No properties found</p>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Bookings</h2>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="mb-1 h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : data.bookings.length > 0 ? (
                      data.bookings.map((booking) => {
                        const property = data.properties.find(p => p._id === booking.propertyId);
                        return (
                          <div key={booking._id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center space-x-4">
                              {property?.images?.[0] ? (
                                <img
                                  src={property.images[0] as string}
                                  alt={property.name}
                                  className="h-16 w-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Home className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {property?.name || 'Unknown Property'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No bookings found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Transactions</h2>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="mb-1 h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : data.transactions.length > 0 ? (
                      data.transactions.map((transaction) => (
                        <div key={transaction._id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-gray-100 p-2">
                              <CreditCard className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">#{transaction._id?.slice(-6)}</h3>
                              <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="font-medium text-gray-900">
                              ${transaction.amount.toLocaleString()}
                            </p>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No transactions found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

         {/* Maintenance Tab */}
{activeTab === 'maintenance' && (
  <div className="space-y-6">
    {/* Header with New Request Button */}
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
      <SubmitButton
        onClick={() => setShowCreateDialog(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        New Request
      </SubmitButton>
    </div>

    {/* Create Maintenance Request Modal */}
    {showCreateDialog && (
      <dialog className="fixed inset-0 w-[50%] bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create Maintenance Request</h3>
              <button 
                onClick={() => setShowCreateDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              
                <DropDownField
                className="w-full"
                  options={data.properties.map(property => ({
                    value: property._id,
                    label: property.name || `Property ${property._id.substring(0, 5)}`,
                  }))}
                  label="Select a property"
                  selected={newRequest.propertyId}
                  onChange={(value) => setNewRequest({...newRequest, propertyId: value})}
                />
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the maintenance issue..."
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <SubmitButton
                onClick={async () => {
                  try {
                    if (!user?._id) {
                      throw new Error('User not authenticated');
                    }
                    await MaintenanceRequestService.create({
                      ...newRequest,
                      clientId: user._id,
                      status: "pending",
                      reportedAt: new Date()
                    });
                    setShowCreateDialog(false);
                    setNewRequest({ propertyId: '', description: '' });
                    fetchData();
                    // Simple toast notification
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
                    toast.textContent = 'Maintenance request created successfully';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                  } catch (error) {
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg';
                    toast.textContent = 'Failed to create maintenance request';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                    console.error(error);
                  }
                }}
              >
                Submit Request
              </SubmitButton>
            </div>
          </div>
        </div>
      </dialog>
    )}

    {/* Maintenance Requests List */}
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : data.maintenanceRequests.length > 0 ? (
            data.maintenanceRequests.map((request) => {
              const property = data.properties.find(p => p._id === request.propertyId);
              const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800',
                'in-progress': 'bg-blue-100 text-blue-800',
                resolved: 'bg-green-100 text-green-800'
              };
              // New
              return (
                <div key={request._id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-100 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{request.description}</h3>
                      <p className="text-sm text-gray-500">
                        {property?.name || 'Unknown Property'} • {new Date(request.reportedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No maintenance requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;