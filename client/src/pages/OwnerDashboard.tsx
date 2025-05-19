import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Sparkles,
  Building,
  Calendar
} from 'lucide-react';
import PropertyService from '../services/PropertyService';
import TransactionService from '../services/TransactionService';
import BookingService from '../services/BookingService';
import MaintenanceService from '../services/MaintenanceRequestService'; 
interface UpcomingPayment {
  _id: string;
  propertyName: string;
  amount: number;
  date: Date;
}

interface MaintenanceAlert {
  _id: string;
  propertyId: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  reportedAt: Date;
}

interface PropertyStats {
  totalProperties: number;
  occupancyRate: number;
  monthlyIncome: number;
  upcomingPayments: UpcomingPayment[];
  maintenanceAlerts: MaintenanceAlert[];
  aiInsights: string[];
}

export default function OwnerDashboard() {
  const [propertyStats, setPropertyStats] = useState<PropertyStats>({
    totalProperties: 0,
    occupancyRate: 0,
    monthlyIncome: 0,
    upcomingPayments: [],
    maintenanceAlerts: [],
    aiInsights: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Fetch properties
        const properties = await PropertyService.getAll();
        const totalProperties = properties.length;

        const transactions = await TransactionService.getAll();
        const monthlyIncome = transactions
          .filter(t => t.status === 'completed' && new Date(t.date).getMonth() === new Date().getMonth())
          .reduce((sum, t) => sum + t.amount, 0);

        const bookings = await BookingService.getAll();
        const occupiedProperties = bookings.filter(b => b.status === 'confirmed').length;
        const occupancyRate = ((occupiedProperties / totalProperties) * 100).toFixed(2);

        const maintenanceAlerts = await MaintenanceService.getAll();
        const aiInsights = [
          "Consider adjusting rent prices for Properties A and B based on market trends",
          "Schedule preventive maintenance for 3 properties to avoid future issues",
        ];

        setPropertyStats({
          totalProperties,
          occupancyRate: parseFloat(occupancyRate),
          monthlyIncome,
          upcomingPayments: transactions.filter(t => t.status === 'pending'),
          maintenanceAlerts,
          aiInsights
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Property Owner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{
          icon: <Building className="text-blue-600 dark:text-blue-400" size={24} />, 
          title: "Total Properties", 
          value: propertyStats.totalProperties, 
          description: "Active properties"
        }, {
          icon: <Users className="text-green-600 dark:text-green-400" size={24} />, 
          title: "Occupancy Rate", 
          value: `${propertyStats.occupancyRate}%`, 
          description: "+2.5% from last month"
        }, {
          icon: <DollarSign className="text-indigo-600 dark:text-indigo-400" size={24} />, 
          title: "Monthly Income", 
          value: `€${propertyStats.monthlyIncome}`, 
          description: "+€1,200 from last month"
        }, {
          icon: <AlertTriangle className="text-orange-600 dark:text-orange-400" size={24} />, 
          title: "Maintenance Alerts", 
          value: propertyStats.maintenanceAlerts.length, 
          description: "Requires attention"
        }].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors duration-200">
            <div className="flex items-center space-x-2 mb-4">
              {stat.icon}
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[{
          title: "Upcoming Payments",
          icon: <Calendar className="text-gray-400 dark:text-gray-500" size={20} />,
          items: propertyStats.upcomingPayments.map(payment => ({
            key: payment._id,
            content: (
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{payment.propertyName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(payment.date).toLocaleDateString()}</p>
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">€{payment.amount}</div>
              </div>
            )
          }))
        }, {
          title: "Maintenance Alerts",
          icon: <AlertTriangle className="text-orange-500 dark:text-orange-400" size={20} />,
          items: propertyStats.maintenanceAlerts.map(alert => ({
            key: alert._id,
            content: (
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{alert.propertyId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{alert.description}</p>
                </div>
                <span className={`p-1 rounded-lg h-auto text-xs text-center flex items-center justify-center font-medium ${
                  alert.status === 'pending' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
              </div>
            )
          }))
        }].map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.title}</h2>
              {section.icon}
            </div>
            <div className="p-6 space-y-4">
              {section.items.map(item => <div key={item.key}>{item.content}</div>)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Insights</h2>
          <Sparkles className="text-purple-500 dark:text-purple-400" size={20} />
        </div>
        <div className="p-6 space-y-4">
          {propertyStats.aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors duration-200">
              <Sparkles className="text-purple-500 dark:text-purple-400 mt-1" size={16} />
              <p className="text-gray-800 dark:text-gray-200">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}