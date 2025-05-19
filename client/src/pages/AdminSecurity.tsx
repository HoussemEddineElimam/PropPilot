import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  UserX,
  Lock,
  Activity,
  Eye,
  Ban,
  Flag,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import SecurityCard from '../components/AdminComponents/SecurityCard';
import { FlaggedUser, LoginAttempt, SecurityAlert, SecurityMetrics } from '../models/statistics/security';
import SubmitButton from '../components/submit button/SubmitButton';



//Mock data
const mockSecurityMetrics: SecurityMetrics = {
  totalAlerts: 24,
  activeThreats: 5,
  systemHealth: 'secure',
  encryptionStatus: true,
  failedLogins24h: 12,
  suspiciousActivities: 3,
};

const mockFlaggedUsers: FlaggedUser[] = [
  {
    _id: 'USR001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    riskScore: 85,
    flagReason: 'Multiple failed login attempts from different locations',
    lastActivity: new Date('2025-02-15T10:30:00'),
    status: 'under_review',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    documentStatus: 'pending',
  },
  {
    _id: 'USR002',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    riskScore: 92,
    flagReason: 'Suspicious transaction pattern detected',
    lastActivity: new Date('2025-02-15T09:15:00'),
    status: 'active',
    ipAddress: '192.168.1.2',
    location: 'London, UK',
    documentStatus: 'rejected',
  },
];

const mockLoginAttempts: LoginAttempt[] = [
  {
    _id: 'LOGIN001',
    userId: 'USR001',
    userName: 'John Smith',
    timestamp: new Date('2025-02-15T10:30:00'),
    status: 'failed',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'iPhone 12',
  },
  {
    _id: 'LOGIN002',
    userId: 'USR002',
    userName: 'Alice Johnson',
    timestamp: new Date('2025-02-15T09:15:00'),
    status: 'success',
    ipAddress: '192.168.1.2',
    location: 'London, UK',
    device: 'Chrome Windows',
  },
];

const mockSecurityAlerts: SecurityAlert[] = [
  {
    _id: 'ALERT001',
    type: 'fraud',
    severity: 'high',
    timestamp: new Date('2025-02-15T10:30:00'),
    description: 'Multiple failed login attempts detected',
    status: 'active',
    userId: 'USR001',
    userName: 'John Smith',
    ipAddress: '192.168.1.1',
  },
  {
    _id: 'ALERT002',
    type: 'suspicious_activity',
    severity: 'medium',
    timestamp: new Date('2025-02-15T09:15:00'),
    description: 'Unusual transaction pattern observed',
    status: 'active',
    userId: 'USR002',
    userName: 'Alice Johnson',
    ipAddress: '192.168.1.2',
  },
];

const AdminSecurity = () => {
  const [metrics] = useState<SecurityMetrics>(mockSecurityMetrics);
  const [flaggedUsers] = useState<FlaggedUser[]>(mockFlaggedUsers);
  const [loginAttempts] = useState<LoginAttempt[]>(mockLoginAttempts);
  const [securityAlerts] = useState<SecurityAlert[]>(mockSecurityAlerts);
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'flagged' | 'activity' | 'settings'>('overview');

  const getHealthColor = (health: SecurityMetrics['systemHealth']) => {
    switch (health) {
      case 'secure':
        return 'text-green-600 dark:text-green-400';
      case 'at_risk':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 dark:text-red-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  

  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Security Details</h2>
              <button
                onClick={() => setIsUserDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">User Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Name:</span> {selectedUser.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> {selectedUser.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                          selectedUser.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {selectedUser.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Risk Score:</span>{' '}
                      <span className={getRiskScoreColor(selectedUser.riskScore)}>
                        {selectedUser.riskScore}%
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Activity Details</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Last Activity:</span>{' '}
                      {selectedUser.lastActivity.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">IP Address:</span> {selectedUser.ipAddress}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span> {selectedUser.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Document Status:</span>{' '}
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${selectedUser.documentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                          selectedUser.documentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {selectedUser.documentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Flag Reason</h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  {selectedUser.flagReason}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Ban className="w-5 h-5" />
                  Block User
                </button>
                <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2">
                  <Flag className="w-5 h-5" />
                  Mark for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SecurityOverview = () => (
    <div className="space-y-6">
      {/*Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityCard
          icon={AlertTriangle}
          label="Active Security Alerts"
          value={metrics.totalAlerts}
          trend="5 new in last 24h"
        />
        <SecurityCard
          icon={UserX}
          label="Active Threats"
          value={metrics.activeThreats}
          trend="2 high priority"
        />
        <SecurityCard
          icon={Activity}
          label="System Health"
          value={metrics.systemHealth.replace('_', ' ')}
          color={getHealthColor(metrics.systemHealth)}
        />
        <SecurityCard
          icon={Lock}
          label="Encryption Status"
          value={metrics.encryptionStatus ? 'Active' : 'Inactive'}
          color={metrics.encryptionStatus ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {/*Recent Security Alerts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Security Alerts</h2>
          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {securityAlerts.map((alert) => (
            <div
              key={alert._id}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50"
            >
              <div className={`
                p-2 rounded-lg
                ${alert.severity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
              `}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{alert.description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.userName} • {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${alert.status === 'active' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
                  `}>
                    {alert.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    IP: {alert.ipAddress}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FlaggedUsers = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Flagged Users</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5" />
                Export List
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Risk Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Last Activity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {flaggedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getRiskScoreColor(user.riskScore)}`}>
                        {user.riskScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          user.status === 'blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
                      `}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.lastActivity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserDetailsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                          <Ban className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Login Activity</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5" />
                Export Log
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">IP Address</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Device</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loginAttempts.map((attempt) => (
                  <tr
                    key={attempt._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {attempt.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{attempt.userName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">ID: {attempt.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${attempt.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
                      `}>
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {attempt.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {attempt.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {attempt.device}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {attempt.timestamp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  
  return (
    <div className="space-y-6">
      {/*Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Security Management</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
            Refresh Data
          </button>
          <SubmitButton onClick={()=>{}}>
          <Download className="w-5 h-5" />
          Export Report
          </SubmitButton>
         
        </div>
      </div>

      {/*Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'flagged', label: 'Flagged Users', icon: UserX },
          { id: 'activity', label: 'Activity Log', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/*Tab Content */}
      {activeTab === 'overview' && <SecurityOverview />}
      {activeTab === 'flagged' && <FlaggedUsers />}
      {activeTab === 'activity' && <ActivityMonitoring />}

      {/*User Details Modal */}
      {isUserDetailsModalOpen && <UserDetailsModal />}
    </div>
  );
};

export default AdminSecurity;