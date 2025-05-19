import { useState, useEffect } from 'react';
import {
  DollarSign,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  Clock,
  Receipt,
  Calculator,
  BarChart3,
} from 'lucide-react';
import LeaseService from '../services/LeaseService'; 
import TransactionService from '../services/TransactionService'; 
import Transaction from '../models/Transaction';
import useAuthStore from '../hooks/useAuthStore';
import { useTheme } from '../hooks/useTheme';
import LoadingScreen from '../components/LoadingScreen';
import DropDownField from '../components/dropdown field/DropDownField';
import { AxiosError } from 'axios';

interface FinancialData {
  rentPayments: {
    received: number;
    pending: number;
    overdue: number;
    total: number;
  };
  expenses: {
    id: string;
    category: string;
    amount: number;
    date: string;
    property: string;
  }[];
  latePayments: {
    id: string;
    tenant: string;
    property: string;
    amount: number;
    daysLate: number;
    penalty: number;
  }[];
  monthlyIncome: {
    month: string;
    income: number;
  }[];
}

export default function FinancialDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const generateMonthlyIncomeData = (transactions: Transaction[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({ month, income: 0 }));
    
    const rentTransactions = transactions.filter(t => 
      t.type === 'rent' && t.status === 'completed'
    );
    
    rentTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].income += transaction.amount;
    });
    
    return monthlyData;
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!user?._id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel
        const [leases, transactions] = await Promise.all([
          LeaseService.getAllByOwnerId(user._id),
          TransactionService.getAllByUserId(user._id)
        ]);

        if (!Array.isArray(leases) ){
          throw new Error('Invalid leases data received');
        }

        if (!Array.isArray(transactions)) {
          throw new Error('Invalid transactions data received');
        }

        const rentPayments = {
          received: transactions
            .filter(t => t.type === 'rent' && t.status === 'completed' && user._id === t.receiverId)
            .reduce((sum, t) => sum + t.amount, 0),
          pending: transactions
            .filter(t => t.type === 'rent' && t.status === 'pending' && user._id === t.receiverId)
            .reduce((sum, t) => sum + t.amount, 0),
          overdue: transactions
            .filter(t => t.type === 'rent' && t.status === 'failed' && user._id === t.receiverId)
            .reduce((sum, t) => sum + t.amount, 0),
          total: leases.reduce((sum, lease) => sum + (lease.rentAmount || 0), 0),
        };

        // Process expenses
        const expenses = transactions
          .filter(t => t.type === 'deposit')
          .map(t => ({
            id: t._id || 'unknown-id',
            category: t.type || 'uncategorized',
            amount: t.amount || 0,
            date: t.date ? new Date(t.date).toISOString().split('T')[0] : 'unknown-date',
            property: t.propertyName || `Property ${t.propertyId || 'unknown'}`,
          }));

        // Process late payments
        const latePayments = transactions
          .filter(t => t.type === 'rent' && t.status === 'failed')
          .map(t => {
            const transactionDate = t.date ? new Date(t.date) : new Date();
            const daysLate = Math.floor((new Date().getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
            
            return {
              id: t._id || 'unknown-id',
              tenant: t.payerName || (t.payerId ? `Client ${t.payerId}` : 'Unknown Tenant'),
              property: t.propertyName || (t.propertyId ? `Property ${t.propertyId}` : 'Unknown Property'),
              amount: t.amount || 0,
              daysLate: daysLate > 0 ? daysLate : 0,
              penalty: (t.amount || 0) * 0.1,
            };
          });

        const monthlyIncome = generateMonthlyIncomeData(transactions);

        setFinancialData({
          rentPayments,
          expenses,
          latePayments,
          monthlyIncome
        });
      } catch (err) {
        let errorMessage = 'Failed to fetch financial data';
        
        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Financial dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [user]);

  const handleSendReminder = async (paymentId: string) => {
    try {
      console.log(`Sending reminder for payment ${paymentId}`);
      alert(`Reminder sent for payment ${paymentId}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder');
    }
  };

  const handleGenerateReport = async () => {
    try {
      console.log(`Generating ${selectedPeriod} report`);
      alert(`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} report is being generated`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  const handleExport = async () => {
    try {
      console.log('Exporting financial data');
      alert('Financial data export started');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  const themeStyles = {
    backgroundColor: theme === "dark" ? "bg-gray-900" : "bg-gray-100",
    textColor: theme === "dark" ? "text-gray-100" : "text-gray-900",
    cardBackground: theme === "dark" ? "bg-gray-800" : "bg-white",
    cardBorder: theme === "dark" ? "border-gray-700" : "border-gray-200",
    cardText: theme === "dark" ? "text-gray-300" : "text-gray-700",
    buttonBackground: theme === "dark" ? "bg-gray-700" : "bg-gray-200",
    buttonHover: theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300",
    buttonText: theme === "dark" ? "text-gray-300" : "text-gray-700",
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${themeStyles.backgroundColor}`}>
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className={`flex items-center justify-center h-screen ${themeStyles.backgroundColor}`}>
        <div className="text-lg text-yellow-500">No financial data available</div>
      </div>
    );
  }

  return (
    <div className={`flex-1 min-w-0 ${themeStyles.backgroundColor}`}>
      <header className={`${themeStyles.cardBackground} border-b ${themeStyles.cardBorder} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-semibold ${themeStyles.textColor}`}>Financial Management</h1>
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center cursor-pointer space-x-2 px-4 py-2 text-sm font-medium ${themeStyles.buttonText} ${themeStyles.buttonBackground} border ${themeStyles.cardBorder} rounded-md ${themeStyles.buttonHover} transition duration-200`}
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center cursor-pointer space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${themeStyles.cardBackground} p-6 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border ${themeStyles.cardBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${themeStyles.cardText}`}>Total Rent Collected</h3>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <div className={`text-2xl font-bold ${themeStyles.textColor}`}>€{financialData.rentPayments.received.toLocaleString()}</div>
            <div className="text-sm text-green-500 mt-1">+5% from last month</div>
          </div>

          <div className={`${themeStyles.cardBackground} p-6 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border ${themeStyles.cardBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${themeStyles.cardText}`}>Pending Payments</h3>
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div className={`text-2xl font-bold ${themeStyles.textColor}`}>€{financialData.rentPayments.pending.toLocaleString()}</div>
            <div className="text-sm text-yellow-500 mt-1">
              {financialData.rentPayments.pending > 0
                ? `${financialData.expenses.filter(e => e.category === 'pending').length || 1} payments pending`
                : 'No pending payments'}
            </div>
          </div>

          {/* Overdue Payments */}
          <div className={`${themeStyles.cardBackground} p-6 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border ${themeStyles.cardBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${themeStyles.cardText}`}>Overdue Payments</h3>
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <div className={`text-2xl font-bold ${themeStyles.textColor}`}>€{financialData.rentPayments.overdue.toLocaleString()}</div>
            <div className="text-sm text-red-500 mt-1">{financialData.latePayments.length} payments overdue</div>
          </div>

          <div className={`${themeStyles.cardBackground} p-6 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border ${themeStyles.cardBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${themeStyles.cardText}`}>Total Expenses</h3>
              <Receipt className="text-indigo-400" size={20} />
            </div>
            <div className={`text-2xl font-bold ${themeStyles.textColor}`}>
              €{financialData.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-indigo-400 mt-1">This month</div>
          </div>
        </div>

        <div className={`${themeStyles.cardBackground} rounded-lg shadow-sm mb-8 border ${themeStyles.cardBorder}`}>
          <div className={`p-6 border-b ${themeStyles.cardBorder}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${themeStyles.textColor}`}>Income Reports</h2>
              <div className="flex items-center space-x-4">
              <DropDownField
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "quarterly", label: "Quarterly" },
                    { value: "annual", label: "Annual" },
                  ]}
                    selected={selectedPeriod}
                    label="Select Period"
                    onChange={setSelectedPeriod} 
                    small
                  /> 
                <button
                  onClick={handleGenerateReport}
                  className={`flex items-center space-x-2 px-2 py-1.5 text-sm font-medium text-blue-400 hover:${themeStyles.buttonHover} rounded-md`}
                >
                  <FileText size={16} />
                  <span>Predict</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Income chart visualization */}
            <div className={`h-64 ${themeStyles.cardBackground} rounded-lg`}>
              <div className="flex h-full">
                <div className={`flex flex-col justify-between text-xs ${themeStyles.cardText} py-2 pr-2`}>
                  <span>€5,000</span>
                  <span>€4,000</span>
                  <span>€3,000</span>
                  <span>€2,000</span>
                  <span>€1,000</span>
                  <span>€0</span>
                </div>
                <div className="flex-1 flex items-end justify-between">
                  {financialData.monthlyIncome.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-blue-500 rounded-t-sm mx-1"
                        style={{
                          height: `${(data.income / 5000) * 100}%`,
                          minHeight: data.income > 0 ? '4px' : '0px',
                          backgroundColor: data.income === 0 ? (theme === "dark" ? '#4b5563' : '#e5e7eb') : undefined
                        }}
                      ></div>
                      <span className={`text-xs ${themeStyles.cardText} mt-1`}>{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center">
                <BarChart3 size={16} className="text-blue-400 mr-2" />
                <span className={`text-sm ${themeStyles.cardText}`}>Monthly Income (€)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${themeStyles.cardBackground} rounded-lg shadow-sm border ${themeStyles.cardBorder}`}>
            <div className={`p-6 border-b ${themeStyles.cardBorder}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${themeStyles.textColor}`}>Recent Expenses</h2>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {financialData.expenses.length > 0 ? (
                <div className="space-y-4">
                  {financialData.expenses.map((expense) => (
                    <div key={expense.id} className={`flex items-center justify-between p-3 hover:${themeStyles.buttonHover} rounded-lg transition-colors duration-150`}>
                      <div>
                        <p className={`font-medium ${themeStyles.textColor}`}>{expense.category}</p>
                        <p className={`text-sm ${themeStyles.cardText}`}>{expense.property}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${themeStyles.textColor}`}>€{expense.amount.toLocaleString()}</p>
                        <p className={`text-sm ${themeStyles.cardText}`}>{expense.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className={`${themeStyles.cardText}`}>No expenses recorded</p>
                </div>
              )}
            </div>
          </div>

          <div className={`${themeStyles.cardBackground} rounded-lg shadow-sm border ${themeStyles.cardBorder}`}>
            <div className={`p-6 border-b ${themeStyles.cardBorder}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${themeStyles.textColor}`}>Late Payment Alerts</h2>
                <Calculator className={`${themeStyles.cardText}`} size={20} />
              </div>
            </div>
            <div className="p-6">
              {financialData.latePayments.length > 0 ? (
                <div className="space-y-4">
                  {financialData.latePayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`flex items-center justify-between p-4 bg-red-900 bg-opacity-30 rounded-lg border border-red-800`}
                    >
                      <div>
                        <p className={`font-medium ${themeStyles.textColor}`}>{payment.tenant}</p>
                        <p className={`text-sm ${themeStyles.cardText}`}>{payment.property}</p>
                        <p className="text-sm text-red-400 mt-1">
                          {payment.daysLate} days late • €{payment.penalty} penalty
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${themeStyles.textColor}`}>€{payment.amount.toLocaleString()}</p>
                        <button
                          onClick={() => handleSendReminder(payment.id)}
                          className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                        >
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className={`${themeStyles.cardText}`}>No late payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}