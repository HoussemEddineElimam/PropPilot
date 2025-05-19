//Define types
type Trend = number;
type Performance = { name: string; performance: number };
type Recommendation = {
  id: number;
  type: "pricing" | "amenities" | "marketing";
  title: string;
  description: string;
  impact: "High" | "Medium";
};

export interface AnalyticsData {
  occupancyRate: {
    current: number;
    trend: Trend;
    historical: number[];
  };
  incomeProjection: {
    current: number;
    nextMonth: number;
    trend: Trend;
  };
  marketingMetrics: {
    views: number;
    inquiries: number;
    conversionRate: number;
    platforms: Performance[];
  };
  competitorAnalysis: {
    averageRent: number;
    yourRent: number;
    occupancyComparison: number;
    amenitiesScore: number;
  };
  aiRecommendations: Recommendation[];
}

//Data assignment
