export interface RevenueData {
    name: string;
    value: number;
  }
  
export interface PieData {
    name: string;
    value: number;
    color: string;
  }

export interface PropertyData { 
    name: string;
    occupied: number;
    vacant: number;
  }
  
export interface RecentActivity {
    type: string;
    user?: string;
    property?: string;
    amount?: string;
    message?: string;
    severity?: string;
    action: string;
    time: string;
    icon: any;
  }
  
