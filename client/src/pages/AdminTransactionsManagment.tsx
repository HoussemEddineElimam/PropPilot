import { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  FileDown,
  LucideIcon,
} from 'lucide-react';
import TransactionService from '../services/TransactionService';
import { toast } from 'react-hot-toast';
import Transaction from '../models/Transaction';
import SearchBar from '../components/search_bar/Searchbar';


interface DropdownOption {
  label: string;
  value: string;
}
interface StatCardProps {
  Icon: LucideIcon;
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}
interface DropDownFieldProps {
  label?: string;
  options: DropdownOption[];
  selected: string;
  onChange: (value: string) => void;
}
interface SubmitButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ Icon, label, value }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
};
const DropDownField: React.FC<DropDownFieldProps> = ({ label, options, selected, onChange }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <select
        className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-slate-800"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
const SubmitButton: React.FC<SubmitButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      {children}
    </button>
  );
};

const AdminTransactionsManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>('month');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fetchedTransactions = await TransactionService.getAll();
      setTransactions(fetchedTransactions);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalAmount = (filteredTransactions: Transaction[]): number => 
    filteredTransactions.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0);

  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const todayTransactions = transactions.filter(t => 
    new Date(t.date).toDateString() === today.toDateString()
  );

  const monthTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear
  );

  const yearTransactions = transactions.filter(t => 
    new Date(t.date).getFullYear() === thisYear
  );

  const todayTotal = getTotalAmount(todayTransactions);
  const monthTotal = getTotalAmount(monthTransactions);
  const yearTotal = getTotalAmount(yearTransactions);
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.receiverName && transaction.receiverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || transaction.paymentMethod === selectedPaymentMethod;
    let matchesDateRange = true;
    const transactionDate = new Date(transaction.date);
    if (dateRange === 'day') {
      matchesDateRange = transactionDate.toDateString() === today.toDateString();
    } else if (dateRange === 'month') {
      matchesDateRange = transactionDate.getMonth() === thisMonth && transactionDate.getFullYear() === thisYear;
    } else if (dateRange === 'year') {
      matchesDateRange = transactionDate.getFullYear() === thisYear;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesPaymentMethod && matchesDateRange;
  });
  const exportTransactions = (): void => {
    const headers = ['Transaction ID', 'Payer', 'Receiver', 'Property', 'Amount', 'Type', 'Status', 'Date', 'Payment Method'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t._id,
        t.payerName,
        t.receiverName || '',
        t.propertyName,
        `${t.currency} ${t.amount}`,
        t.type,
        t.status,
        new Date(t.date).toISOString().split('T')[0],
        t.paymentMethod
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  const handleUpdateTransactionStatus = async (status: "pending" | "completed" | "failed"): Promise<void> => {
    if (!selectedTransaction) return;

    try {
      const updatedTransaction = await TransactionService.update(selectedTransaction._id, { status });
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t._id === updatedTransaction._id 
            ? { ...t, status: updatedTransaction.status } 
            : t
        )
      );

      toast.success('Transaction status updated successfully');
      setIsDetailsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update transaction status');
      console.error('Error updating transaction status:', error);
    }
  };
  const TransactionDetailsModal: React.FC = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Transaction Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Transaction ID:</span> {selectedTransaction._id}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Amount:</span> {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Type:</span> {selectedTransaction.type}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Status:</span> {selectedTransaction.status}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Payment Method:</span> {selectedTransaction.paymentMethod.replace('_', ' ')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Date:</span> {new Date(selectedTransaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Property & Parties</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Property:</span> {selectedTransaction.propertyName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Payer:</span> {selectedTransaction.payerName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Receiver:</span> {selectedTransaction.receiverName || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Download Receipt
                </button>
                <div className="flex-1 space-y-2">
                  {selectedTransaction.status !== 'completed' && (
                    <button 
                      onClick={() => handleUpdateTransactionStatus('completed')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {selectedTransaction.status !== 'failed' && (
                    <button 
                      onClick={() => handleUpdateTransactionStatus('failed')}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Mark as Failed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SubmitButton onClick={exportTransactions}>
        <Download className="w-5 h-5" />
        Export Transactions
      </SubmitButton>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          Icon={Calendar}
          label="Today's Revenue"
          value={`$${(todayTotal ?? 0).toLocaleString()}`} 
          trend="up"
        />
        <StatCard
          Icon={DollarSign}
          label="Monthly Revenue"
          value={`$${(monthTotal ?? 0).toLocaleString()}`}
          trend="up"
        />
        <StatCard
          Icon={TrendingUp}
          label="Yearly Revenue"
          value={`$${(yearTotal ?? 0).toLocaleString()}`}
          trend="up"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
       

        <DropDownField
          label="Transaction Type"
          options={[
            { label: "All Types", value: "all" },
            { label: "Rent", value: "rent" },
            { label: "Deposit", value: "deposit" },
            { label: "Sale", value: "sale" },
            { label: "Penalty", value: "penalty" },
          ]}
          selected={selectedType}
          onChange={setSelectedType}
        />

        <DropDownField
          label="Transaction Status"
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Failed", value: "failed" },
          ]}
          selected={selectedStatus}
          onChange={setSelectedStatus}
        />

        <DropDownField
          label="Payment Method"
          options={[
            { label: "All Payment Methods", value: "all" },
            { label: "Credit Card", value: "credit_card" },
            { label: "Bank Transfer", value: "bank_transfer" },
            { label: "PayPal", value: "paypal" },
          ]}
          selected={selectedPaymentMethod}
          onChange={setSelectedPaymentMethod}
        />

        <DropDownField
          label="Date Range"
          options={[
            { label: "Today", value: "day" },
            { label: "This Month", value: "month" },
            { label: "This Year", value: "year" },
          ]}
          selected={dateRange}
          onChange={(value) => setDateRange(value)}
        />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Payer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {transaction._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.payerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.receiverName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.propertyName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {transaction.currency} {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }
                        `}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsDetailsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isDetailsModalOpen && <TransactionDetailsModal />}
    </div>
  );
};

export default AdminTransactionsManagement;