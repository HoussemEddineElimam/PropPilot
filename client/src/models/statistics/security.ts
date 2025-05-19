export interface SecurityAlert {
    _id: string;
    type: 'fraud' | 'login' | 'suspicious_activity';
    severity: 'high' | 'medium' | 'low';
    timestamp: Date;
    description: string;
    status: 'active' | 'resolved';
    userId?: string;
    userName?: string;
    ipAddress?: string;
  }
  
 export  interface FlaggedUser {
    _id: string;
    name: string;
    email: string;
    riskScore: number;
    flagReason: string;
    lastActivity: Date;
    status: 'active' | 'blocked' | 'under_review';
    ipAddress: string;
    location: string;
    documentStatus: 'verified' | 'pending' | 'rejected';
  }
  
 export  interface LoginAttempt {
    _id: string;
    userId: string;
    userName: string;
    timestamp: Date;
    status: 'success' | 'failed';
    ipAddress: string;
    location: string;
    device: string;
  }
  
 export  interface SecurityMetrics {
    totalAlerts: number;
    activeThreats: number;
    systemHealth: 'secure' | 'at_risk' | 'critical';
    encryptionStatus: boolean;
    failedLogins24h: number;
    suspiciousActivities: number;
  }