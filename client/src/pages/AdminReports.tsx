import  { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import DropDownField from '../components/dropdown field/DropDownField';
import { financialMetrics, occupancyData } from '../utils/data';

const AdminReports = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  
  const financialMetricsMemo = useMemo(()=>{
    return financialMetrics;
  },[financialMetrics]);
  const occupancyDataMemo = useMemo(()=>{
    return occupancyData;
  },[occupancyData])
  const clientRiskData = {
    highRisk: 5,
    mediumRisk: 12,
    lowRisk: 83,
    potentialDefaults: 3
  };

  return (
    <div className="space-y-6">
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <DropDownField
          label="Time Range"
          options={[
            { label: "Last Week", value: "week" },
            { label: "Last Month", value: "month" },
            { label: "Last Quarter", value: "quarter" },
            { label: "Last Year", value: "year" },
          ]}
          selected={selectedTimeRange}
          onChange={setSelectedTimeRange}
        />

      </div>

      {/*ML-Powered Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/*Financial Predictions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Revenue Forecast</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">${financialMetricsMemo.predictedIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Monthly Revenue</p>
          </div>
        </div>

        {/*Occupancy Predictions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Occupancy Forecast</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{occupancyDataMemo.predicted}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Predicted Occupancy Rate
              <span className="ml-2 text-green-500">
                <TrendingUp className="w-4 h-4 inline" />
              </span>
            </p>
          </div>
        </div>

        {/*Risk Assessment */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Risk Assessment</h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{financialMetrics.riskScore}/100</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Portfolio Health Score</p>
          </div>
        </div>

        {/*Anomaly Detection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Anomaly Detection</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{financialMetrics.anomalyCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Detected Anomalies This Month</p>
          </div>
        </div>
      </div>

      {/*Client Risk Analysis */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Client Risk Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Low Risk Clients</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{clientRiskData.lowRisk}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Medium Risk Clients</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{clientRiskData.mediumRisk}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Risk Clients</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{clientRiskData.highRisk}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;