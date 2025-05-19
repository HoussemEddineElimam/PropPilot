import { useState } from "react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: ExportOptions) => void;
}

interface ExportOptions {
  dateRange: string;
  columns: string[];
}

const dateRangeOptions = [
  { id: 'today', label: 'Today', range: '14 Feb' },
  { id: 'currentMonth', label: 'Current month', range: '1 Feb–14 Feb' },
  { id: 'last7days', label: 'Last 7 days', range: '7 Feb–14 Feb' },
  { id: 'last4weeks', label: 'Last 4 weeks', range: '18 Jan–14 Feb' },
  { id: 'lastMonth', label: 'Last month', range: '1 Jan–31 Jan' },
  { id: 'all', label: 'All', range: '' },
  { id: 'custom', label: 'Custom', range: '' },
];

const defaultColumns = [
  'ID', 'Description', 'Email', 'Name', 'Created (UTC)', 
  'Card ID', 'Total Spend', 'Payment Count', 'Refunded Volume', 
  'Dispute Losses'
];

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Export customers</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date range
              </label>
              <div className="space-y-2">
                {dateRangeOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="dateRange"
                      value={option.id}
                      checked={selectedDateRange === option.id}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                    {option.range && (
                      <span className="text-sm text-gray-500">{option.range}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columns
              </label>
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue="default"
                >
                  <option value="default">Default (10)</option>
                </select>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {defaultColumns.join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onExport({ dateRange: selectedDateRange, columns: defaultColumns })}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}