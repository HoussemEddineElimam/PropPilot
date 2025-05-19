import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ArrowUpRight, Download, Plus, CheckCircle,
  AlertCircle, TrendingUp, DollarSign, Home
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import StatCard from '../components/StatsCard';
import DropDownField from '../components/dropdown field/DropDownField';

import PropertyService from '../services/PropertyService';
import TransactionService from '../services/TransactionService';
import LeaseService from '../services/LeaseService';
import BookingService from '../services/BookingService';

interface KpiCard {
  icon: any;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PropertyData {
  name: string;
  sold: number;
  vacant: number;
}

interface RecentActivity {
  type: 'alert' | 'info';
  icon: any;
  user?: string;
  property?: string;
  amount?: string;
  message?: string;
  action: string;
  time: string;
}

interface RevenueData {
  name: string;
  value: number;
}

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const [kpiCards, setKpiCards] = useState<KpiCard[]>([]);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [propertyData, setPropertyData] = useState<PropertyData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchKpiData(),
          fetchRevenueData(),
          fetchPropertyData(),
          fetchRecentActivity()
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [timeRange]);
  const fetchKpiData = async () => {
    try {
      const [properties, transactions, leases] = await Promise.all([
        PropertyService.getAll(),
        TransactionService.getAll(),
        LeaseService.getAll()
      ]);
      const totalRevenue = transactions.reduce((sum, transaction) => 
        sum + (transaction.amount || 0), 0);
      const totalProperties = properties.length;
      const saleProperties = properties.filter(p => p.status === 'sold').length;
      const occupancyRate = totalProperties > 0 
        ? ((saleProperties / totalProperties) * 100).toFixed(1) 
        : '0';
      const activeLeases = leases.filter(lease => 
        new Date(lease.endDate) >= new Date()
      ).length;
      
      const prevTotalRevenue = totalRevenue * 0.85; 
      const revenueChange = totalRevenue > prevTotalRevenue 
        ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(1)
        : '0';
      const kpiCardsData: KpiCard[] = [
        {
          icon: DollarSign,
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          trend: 'up',
          change: `+${revenueChange}%`
        },
        {
          icon: Home,
          title: 'Properties',
          value: totalProperties.toString(),
          trend: totalProperties > 0 ? 'up' : 'neutral',
          change: '+5.2%' 
        },
        {
          icon: CheckCircle,
          title: 'Occupancy Rate',
          value: `${occupancyRate}%`,
          trend: parseFloat(occupancyRate) > 70 ? 'up' : 'down',
          change: parseFloat(occupancyRate) > 70 ? '+2.1%' : '-1.3%'
        },
        {
          icon: TrendingUp,
          title: 'Active Leases',
          value: activeLeases.toString(),
          trend: activeLeases > 0 ? 'up' : 'down',
          change: activeLeases > 0 ? '+3.7%' : '-2.8%'
        }
      ];
      
      setKpiCards(kpiCardsData);
      
      const rentalIncome = transactions.filter(t => t.type === 'rent').reduce((sum, t) => sum + (t.amount || 0), 0);
      const depositIncome = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + (t.amount || 0), 0);
      const saleIncome = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + (t.amount || 0), 0);
      const otherIncome = totalRevenue - rentalIncome - depositIncome - saleIncome;
      
      const pieChartData: PieChartData[] = [
        { name: 'Rental Income', value: rentalIncome, color: '#3b82f6' },
        { name: 'Deposits', value: depositIncome, color: '#10b981' },
        { name: 'Fees', value: saleIncome, color: '#f59e0b' },
        { name: 'Other', value: otherIncome, color: '#6366f1' }
      ];
      
      setPieData(pieChartData);
      
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      throw error;
    }
  };
  const fetchRevenueData = async () => {
    try {
      const transactions = await TransactionService.getAll();
      
      const groupedData = new Map<string, number>();
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date || Date.now());
        let key = '';
        
        if (timeRange === 'daily') {
          key = date.toISOString().split('T')[0]; 
        } else if (timeRange === 'monthly') {
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; 
        } else { //yearly
          key = date.getFullYear().toString();
        }
        
        groupedData.set(key, (groupedData.get(key) || 0) + (transaction.amount || 0));
      });
      const revenueChartData: RevenueData[] = Array.from(groupedData.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setRevenueData(revenueChartData);
      
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  };
  const fetchPropertyData = async () => {
    try {
      const properties = await PropertyService.getAll();
      const groupedProperties = new Map<string, { sold: number, vacant: number }>();
      
      properties.forEach(property => {
        const category = property.category || 'Other';
        
        if (!groupedProperties.has(category)) {
          groupedProperties.set(category, { sold: 0, vacant: 0 });
        }
        
        const data = groupedProperties.get(category)!;
        
        if (property.status === 'sold') {
          data.sold++;
        } else {
          data.vacant++;
        }
      });
      const propertyChartData: PropertyData[] = Array.from(groupedProperties.entries())
        .map(([name, data]) => ({ name, ...data }));
      
      setPropertyData(propertyChartData);
      
    } catch (error) {
      console.error('Error fetching property data:', error);
      throw error;
    }
  };
  const fetchRecentActivity = async () => {
    try {
      const [transactions, bookings, properties] = await Promise.all([
        TransactionService.getAll(),
        BookingService.getAll(),
        PropertyService.getAll()
      ]);
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        .slice(0, 3)
        .map(transaction => ({
          type: 'info' as const,
          icon: DollarSign,
          amount: `$${transaction.amount?.toLocaleString()}`,
          action: `Payment for ${transaction.propertyName || 'property'}`,
          time: transaction.date.toLocaleDateString()
        }));
      const recentBookings = bookings
        .sort((a, b) => b.checkOutDate.getTime() - a.checkInDate.getTime())
        .slice(0, 2)
        .map(booking => ({
          type: 'info' as const,
          icon: CheckCircle,
          user: booking.clientId || 'Guest',
          action: `Booked ${booking.propertyId || 'a property'} from ${booking.checkInDate.toLocaleDateString()} to ${booking.checkOutDate.toLocaleDateString()}`,
          time: booking.checkOutDate.toLocaleDateString()
        }));
      
      const recentAlerts = properties
        .filter(p => p.status === 'inactive')
        .slice(0, 2)
        .map(property => ({
          type: 'alert' as const,
          icon: AlertCircle,
          property: property.name || 'Property',
          action: `Maintenance required: ${property.description?.substring(0, 30)}...`,
          time: new Date().toLocaleDateString()
        }));
      const allActivities: RecentActivity[] = [
        ...recentTransactions,
        ...recentBookings,
        ...recentAlerts
      ].sort(() => Math.random() - 0.5).slice(0, 5); 
      
      setRecentActivity(allActivities);
      
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className={`text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Loading dashboard data...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <div className={`text-lg text-red-500`}>
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, index) => (
                <StatCard
                  key={index}
                  Icon={card.icon}  
                  label={card.title}
                  value={card.value}
                  trend={card.trend}
                  change={card.change}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-xl p-6 shadow-sm border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    Revenue Trends
                  </h3>
                  <DropDownField
                    small={true}
                    label="Time Range"
                    options={[
                      { label: "Daily", value: "daily" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Yearly", value: "yearly" },
                    ]}
                    selected={timeRange}
                    onChange={setTimeRange}
                  />
                </div>
                <div className="h-80">
                  {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="name" stroke={isDarkTheme ? "#9CA3AF" : "#6B7280"} />
                        <YAxis stroke={isDarkTheme ? "#9CA3AF" : "#6B7280"} />
                        <Tooltip contentStyle={{ 
                          backgroundColor: isDarkTheme ? '#1F2937' : '#ffffff', 
                          borderRadius: '8px',
                          borderColor: isDarkTheme ? '#374151' : '#e5e7eb', 
                          color: isDarkTheme ? '#fff' : '#111827'
                        }} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        No revenue data available for this time period
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`rounded-xl p-6 shadow-sm border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Revenue Distribution
                </h3>
                <div className="h-80">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ 
                          backgroundColor: isDarkTheme ? '#1F2937' : '#ffffff', 
                          borderRadius: '8px',
                          borderColor: isDarkTheme ? '#374151' : '#e5e7eb', 
                          color: isDarkTheme ? '#fff' : '#111827'
                        }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        No revenue distribution data available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`rounded-xl p-6 shadow-sm border lg:col-span-2 ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Property Occupancy
                </h3>
                <div className="h-80">
                  {propertyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={propertyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="name" stroke={isDarkTheme ? "#9CA3AF" : "#6B7280"} />
                        <YAxis stroke={isDarkTheme ? "#9CA3AF" : "#6B7280"} />
                        <Tooltip contentStyle={{ 
                          backgroundColor: isDarkTheme ? '#1F2937' : '#ffffff', 
                          borderRadius: '8px',
                          borderColor: isDarkTheme ? '#374151' : '#e5e7eb', 
                          color: isDarkTheme ? '#fff' : '#111827'
                        }} />
                        <Legend />
                        <Bar dataKey="sold" name="sold" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="vacant" name="Vacant" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        No property occupancy data available
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`rounded-xl p-6 shadow-sm border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  System Metrics
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        API Requests
                      </span>
                      <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        2.5k/5k
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        Database Usage
                      </span>
                      <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        75%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        Server Uptime
                      </span>
                      <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        99.9%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 rounded-xl p-6 shadow-sm border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h3>
                  <button className={`text-sm font-medium ${
                    isDarkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}>
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'alert' 
                            ? isDarkTheme ? 'bg-red-900/30' : 'bg-red-50'
                            : isDarkTheme ? 'bg-blue-900/30' : 'bg-blue-50'
                        }`}>
                          <activity.icon className={`w-5 h-5 ${
                            activity.type === 'alert' 
                              ? isDarkTheme ? 'text-red-400' : 'text-red-600'
                              : isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                              {activity.user || activity.property || activity.amount || activity.message}
                            </p>
                            <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                              {activity.time}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            {activity.action}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        No recent activity to display
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`rounded-xl p-6 shadow-sm border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                    isDarkTheme 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}>
                    <span className="flex items-center">
                      <Plus className="w-5 h-5 mr-3" />
                      Add New Property
                    </span>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                    isDarkTheme 
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}>
                    <span className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Approve Listings
                    </span>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                    isDarkTheme 
                      ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' 
                      : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  }`}>
                    <span className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-3" />
                      Review Reports
                    </span>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                    isDarkTheme 
                      ? 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50' 
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}>
                    <span className="flex items-center">
                      <Download className="w-5 h-5 mr-3" />
                      Export Data
                    </span>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;