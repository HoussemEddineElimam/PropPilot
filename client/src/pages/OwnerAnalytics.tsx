import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Building,
  LineChart,
  Share2,
  Loader
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import DropDownField from '../components/dropdown field/DropDownField';
import PropertyService from '../services/PropertyService';
import BookingService from '../services/BookingService';
import TransactionService from '../services/TransactionService';
import { Property } from '../models/Property';
import { Booking } from '../models/Booking';
import Transaction from '../models/Transaction';
import useAuthStore from '../hooks/useAuthStore';

export default function OwnerAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const propertiesData = await PropertyService.getAll();
        const userProperties = propertiesData.filter(prop => prop.ownerId === user?._id);
        setProperties(userProperties);
        
        const bookingsData = await BookingService.getAll();
        const propertyIds = userProperties.map(prop => prop._id);
        const userBookings = bookingsData.filter(booking => 
          propertyIds.includes(booking.propertyId)
        );
        setBookings(userBookings);
        
        const transactionsData = await TransactionService.getAll();
        const userTransactions = transactionsData.filter(transaction => 
          propertyIds.includes(transaction.propertyId)
        );
        setTransactions(userTransactions);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, user?._id]);

  const analyticsData = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }
    
    const today = new Date();
    const monthsToSubtract = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - monthsToSubtract);
    
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookedAt);
      return bookingDate >= startDate;
    });
    
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate;
    });
    
    const totalDaysInPeriod = monthsToSubtract * 30; 
    const bookedDays = filteredBookings.reduce((total, booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return total + duration;
    }, 0);
    
    const totalPossibleDays = properties.length * totalDaysInPeriod;
    const currentOccupancyRate = Math.round((bookedDays / totalPossibleDays) * 100) || 0;
    
    const previousStartDate = new Date(startDate);
    previousStartDate.setMonth(previousStartDate.getMonth() - monthsToSubtract);
    const totalIncome = filteredTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const avgMonthlyIncome = Math.round(totalIncome / monthsToSubtract);
    const recentTransactions = filteredTransactions
      .filter(t => {
        const tDate = new Date(t.date);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return tDate >= lastMonth;
      });
    
    const recentIncome = recentTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthIncome = Math.max(recentIncome, avgMonthlyIncome * 0.8);
    
    const trendPercentage = Math.round(((lastMonthIncome / avgMonthlyIncome) - 1) * 100) || 2;
    
    const marketOccupancyComparison = 5; //it's like a place holder
    
    const averageRent = properties.reduce((sum, property) => {
      return sum + (property.rentPrice || 0);
    }, 0) / properties.length || 0;
    
    const marketingPlatforms = [
      { name: 'Airbnb', performance: 85 },
      { name: 'Booking.com', performance: 72 },
      { name: 'Direct Website', performance: 45 },
    ];
    
    const conversionRate = 4.2;
    
    return {
      occupancyRate: {
        current: currentOccupancyRate,
        trend: 2.5,
      },
      incomeProjection: {
        nextMonth: Math.round(avgMonthlyIncome * (1 + trendPercentage/100)),
        trend: trendPercentage,
      },
      competitorAnalysis: {
        occupancyComparison: marketOccupancyComparison,
        yourRent: Math.round(averageRent),
        averageRent: Math.round(averageRent * 0.95), 
        amenitiesScore: 8,
      },
      marketingMetrics: {
        conversionRate: conversionRate,
        platforms: marketingPlatforms,
      },
    };
  }, [properties, bookings, transactions, timeRange]);

  if (loading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-800 dark:text-red-200 max-w-md text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = analyticsData || {
    occupancyRate: { current: 0, trend: 0 },
    incomeProjection: { nextMonth: 0, trend: 0 },
    competitorAnalysis: { 
      occupancyComparison: 0, 
      yourRent: 0, 
      averageRent: 0, 
      amenitiesScore: 0 
    },
    marketingMetrics: {
      conversionRate: 0,
      platforms: []
    }
  };

  return (
    <div className={`flex-1 min-w-0 ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics & Insights</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              AI-powered insights to optimize your property performance
            </p>
          </div>
          <DropDownField
            label='When'
            options={[
              { label: "Last 3 months", value: "3months" },
              { label: "Last 6 months", value: "6months" },
              { label: "Last year", value: "1year" }
            ]}
            selected={timeRange}
            onChange={(value) => setTimeRange(value)}
          />
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Occupancy Rate</h3>
              <Building className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.occupancyRate.current}%</div>
            <div className={`text-sm mt-1 flex items-center ${data.occupancyRate.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.occupancyRate.trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(data.occupancyRate.trend)}% vs last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Projected Income</h3>
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">€{data.incomeProjection.nextMonth}</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
              <ArrowUp size={16} />
              <span>{data.incomeProjection.trend}% projected growth</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Position</h3>
              <Target className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">+{data.competitorAnalysis.occupancyComparison}%</div>
            <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">Above market average</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Performance</h3>
              <Share2 className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.marketingMetrics.conversionRate}%</div>
            <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">Conversion rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <LineChart className="text-green-600 dark:text-green-400 mr-2" size={20} />
                  Performance Trends
                </h2>
              </div>
              <div className="p-6 w-full">
                <div className="h-72 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Performance trends chart will be displayed here</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BarChart2 className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                  Market Comparison
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Your Average Rent</span>
                      <span className="font-medium text-gray-900 dark:text-white">€{data.competitorAnalysis.yourRent}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Market Average</span>
                      <span className="font-medium text-gray-900 dark:text-white">€{data.competitorAnalysis.averageRent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Amenities Score</span>
                      <span className="font-medium text-gray-900 dark:text-white">{data.competitorAnalysis.amenitiesScore}/10</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Marketing Platform Performance</h3>
                    {data.marketingMetrics.platforms.map((platform, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{platform.name}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{platform.performance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${platform.performance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}