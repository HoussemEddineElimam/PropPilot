import { AlertTriangle, Building2, Key, Receipt, TrendingUp, Users } from "lucide-react";
import { Property } from "../models/Property";
import Transaction from "../models/Transaction";
import { Notification } from "../models/Notification";
import { AnalyticsData } from "../models/statistics/owner";
import { PropertyCategory } from "../models/Category";

export const mockProperties: Property[] = [
  {
    _id: '1',
    name: 'Luxury Beachfront Villa',
    description: 'A stunning beachfront property with panoramic ocean views',
    country: 'USA',
    state: 'Florida',
    city: 'Miami Beach',
    ownerId: '101',
    ownerName: 'John Smith',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&w=800',
    ],
    status: 'available',
    type: 'real_estate',
    category: 'Luxury Villa',
    sellPrice: 2500000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: '2',
    name: 'Downtown Apartment',
    description: 'Modern apartment in the heart of the city',
    country: 'USA',
    state: 'New York',
    city: 'New York',
    ownerId: '102',
    ownerName: 'Sma3il SlipMan',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&w=800',
    ],
    status: 'rented',
    type: 'rented_real_estate',
    category: 'Apartment',
    rentPrice: 3500,
    leaseTerm: 'long-term',
    roomCount: 2,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    transactionIds: ['trans001', 'trans002'],
    maintenanceRequestIds: ['maint001'],
    leaseIds: ['lease001'],
    bookingIds: []
  },
  {
    _id: '3',
    name: 'Mountain View Hotel',
    description: 'Luxury hotel with breathtaking mountain views',
    country: 'Switzerland',
    state: 'Valais',
    city: 'Zermatt',
    ownerId: '103',
    ownerName: 'Alpine Properties',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&w=800',
    ],
    status: 'available',
    type: 'hotel',
    category: 'Luxury Hotel',
    rentPrice: 500,
    roomCount: 45,
    createdAt: new Date('2024-03-01'),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: ['book001', 'book002']
  }
];

export  const revenueData = [
    { name: 'Jan', value: 65000 },
    { name: 'Feb', value: 75000 },
    { name: 'Mar', value: 85000 },
    { name: 'Apr', value: 95000 },
    { name: 'May', value: 105000 },
    { name: 'Jun', value: 115000 },
  ];
  
  export  const pieData = [
    { name: 'Sales', value: 65, color: '#3b82f6' },
    { name: 'Rentals', value: 35, color: '#10b981' },
  ];
  
  export  const propertyData = [
    { name: 'Residential', occupied: 85, vacant: 15 },
    { name: 'Commercial', occupied: 75, vacant: 25 },
    { name: 'Industrial', occupied: 90, vacant: 10 },
  ];
  
  export  const recentActivity = [
    {
      type: 'signup',
      user: 'John Doe',
      action: 'joined as property owner',
      time: '5 minutes ago',
      icon: Users,
    },
    {
      type: 'property',
      property: 'Luxury Villa',
      action: 'new listing added',
      time: '15 minutes ago',
      icon: Building2,
    },
    {
      type: 'transaction',
      amount: '$5,000',
      action: 'payment received',
      time: '1 hour ago',
      icon: Receipt,
    },
    {
      type: 'alert',
      message: 'Suspicious activity detected',
      severity: 'high',
      time: '2 hours ago',
      icon: AlertTriangle,
    },
  ];
  
  export  const kpiCards = [
    {
      title: 'Total Users',
      value: '15,234',
      change: '+12.5%',
      trend: "up",
      icon: Users,
    },
    {
      title: 'Properties',
      value: '8,456',
      change: '+8.2%',
      trend: 'up',
      icon: Building2,
    },
    {
      title: 'Active Leases',
      value: '6,789',
      change: '-2.4%',
      trend: "down",
      icon: Key,
    },
    {
      title: 'Revenue',
      value: '$892,345',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];
  
export const mockTransactions: Transaction[] = [
  {
    _id: 'TXN123456',
    payerId: 'USR001',
    payerName: 'Alice Johnson',
    receiverId: 'USR002',
    receiverName: 'John Smith',
    propertyId: 'PROP001',
    propertyName: 'Luxury Villa X',
    amount: 1200,
    currency: 'USD',
    type: 'rent',
    date: new Date('2025-02-15'),
    status: 'completed',
    paymentMethod: 'credit_card',
  },
  {
    _id: 'TXN654321',
    payerId: 'USR003',
    payerName: 'Mike Wilson',
    receiverId: 'USR004',
    receiverName: 'Sarah Davis',
    propertyId: 'PROP002',
    propertyName: 'Hotel Y',
    amount: 500,
    currency: 'USD',
    type: 'deposit',
    date: new Date('2025-02-14'),
    status: 'pending',
    paymentMethod: 'bank_transfer',
  },
  {
    _id: 'TXN987654',
    payerId: 'USR005',
    payerName: 'Bob Anderson',
    receiverId: 'USR006',
    receiverName: 'Owner Z',
    propertyId: 'PROP003',
    propertyName: 'House A',
    amount: 250000,
    currency: 'USD',
    type: 'sale',
    date: new Date('2025-02-13'),
    status: 'failed',
    paymentMethod: 'bank_transfer',
  },
];

export const financialMetrics = {
  predictedIncome: 125000,
  predictedExpenses: 45000,
  riskScore: 85,
  anomalyCount: 3
};

export const occupancyData = {
  current: 78,
  predicted: 82,
  trend: 'up'
};


export const mockNotifications: Notification[] = [
  {
    _id: "1",
    userId: "user123",
    title: "New User Registered",
    description: 'A new user "John Doe" has registered on the platform.',
    type:"info",
    status: "unread",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    _id: "2",
    userId: "user456",
    title: "Payment Failure",
    description: "Payment processing failed for property _ID: PRO123.",
    type:"info",
    status: "unread",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    _id: "3",
    userId: "user789",
    title: "Maintenance Request Completed",
    description: "Maintenance request #45678 has been marked as completed.",
    type:"info",
    status: "read",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), 
  },
  {
    _id: "4",
    userId: "user101",
    title: "Scheduled System Maintenance",
    description: "System maintenance scheduled for tomorrow at 2 AM UTC.",
    type:"info",
    status: "read",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), 
  },
];

export const analyticsData: AnalyticsData = {
  occupancyRate: {
    current: 92,
    trend: 3,
    historical: [88, 85, 90, 87, 89, 92],
  },
  incomeProjection: {
    current: 24500,
    nextMonth: 26000,
    trend: 6.1,
  },
  marketingMetrics: {
    views: 1250,
    inquiries: 45,
    conversionRate: 3.6,
    platforms: [
      { name: "Platform A", performance: 85 },
      { name: "Platform B", performance: 72 },
      { name: "Platform C", performance: 64 },
    ],
  },
  competitorAnalysis: {
    averageRent: 1800,
    yourRent: 1950,
    occupancyComparison: 5,
    amenitiesScore: 8.5,
  },
  aiRecommendations: [
    {
      id: 1,
      type: "pricing",
      title: "Optimize Rental Pricing",
      description:
        "Consider a 5% increase in rent for units in Building A based on market demand",
      impact: "High",
    },
    {
      id: 2,
      type: "amenities",
      title: "Amenity Enhancement",
      description:
        "Adding smart home features could increase rental value by 8-10%",
      impact: "Medium",
    },
    {
      id: 3,
      type: "marketing",
      title: "Marketing Channel Optimization",
      description:
        "Increase presence on Platform A where conversion rates are highest",
      impact: "High",
    },
  ],
};


export const propertyCategories: PropertyCategory[] = [
  { id: "1", name: "Hotel", icon: "🏨" },
  { id: "2", name: "Resort", icon: "🏖️" },
  { id: "3", name: "Serviced Apartment", icon: "🛏️" },
  { id: "4", name: "Apartment", icon: "🏢" },
  { id: "5", name: "Townhouse", icon: "🏠" },
  { id: "6", name: "Luxury Villa", icon: "🏡" },
  { id: "7", name: "Penthouse", icon: "🌆" },
  { id: "8", name: "Office Space", icon: "🏬" },
  { id: "9", name: "Retail Store", icon: "🛍️" },
  { id: "10", name: "Warehouse", icon: "🏭" }
];


export const properties: Property[] = [
  {
    _id: "1",
    name: "Modern Apartment in City Center",
    description: "A stylish apartment located in the heart of the city.",
    country: "Algeria",
    state: "Algiers",
    city: "Algiers",
    ownerId: "1001",
    ownerName: "John Doe",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Apartments",
    rentPrice: 1200,
    leaseTerm: "long-term",
    roomCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "2",
    name: "Luxury Villa with Pool",
    description: "A stunning villa with a private pool and ocean view.",
    country: "Algeria",
    state: "Oran",
    city: "Oran",
    ownerId: "1002",
    ownerName: "Jane Smith",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Villas",
    sellPrice: 350000,
    roomCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "3",
    name: "Cozy Studio Near University",
    description: "A small but comfortable studio near the university area.",
    country: "Algeria",
    state: "Blida",
    city: "Blida",
    ownerId: "1003",
    ownerName: "Ahmed Karim",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "rented",
    type: "rented_real_estate",
    category: "Apartments",
    rentPrice: 650,
    leaseTerm: "short-term",
    roomCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: ["trans001"],
    maintenanceRequestIds: [],
    leaseIds: ["lease001"],
    bookingIds: []
  },
  {
    _id: "4",
    name: "Family Home with Garden",
    description: "A spacious family home with a large garden.",
    country: "Algeria",
    state: "Algiers",
    city: "Algiers",
    ownerId: "1004",
    ownerName: "Fatima Bensalem",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Houses",
    sellPrice: 180000,
    roomCount: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "5",
    name: "Penthouse with City Views",
    description: "A luxurious penthouse with panoramic city views.",
    country: "Algeria",
    state: "Oran",
    city: "Oran",
    ownerId: "1005",
    ownerName: "Karim Dali",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Apartments",
    sellPrice: 280000,
    roomCount: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "6",
    name: "Renovated Historic Apartment",
    description: "A charming apartment in a historic building.",
    country: "Algeria",
    state: "Blida",
    city: "Blida",
    ownerId: "1006",
    ownerName: "Yasmine Taha",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "rented",
    type: "rented_real_estate",
    category: "Apartments",
    rentPrice: 1400,
    leaseTerm: "long-term",
    roomCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: ["trans002"],
    maintenanceRequestIds: ["maint001"],
    leaseIds: ["lease002"],
    bookingIds: []
  },
  {
    _id: "7",
    name: "Modern Office Space",
    description: "A fully equipped office in the business district.",
    country: "Algeria",
    state: "Algiers",
    city: "Algiers",
    ownerId: "1007",
    ownerName: "Sami Ferhat",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Offices",
    rentPrice: 2200,
    leaseTerm: "long-term",
    roomCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "8",
    name: "Beachfront Condo",
    description: "A modern beachfront condo with ocean views.",
    country: "Algeria",
    state: "Oran",
    city: "Oran",
    ownerId: "1008",
    ownerName: "Hassan Louh",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "sold",
    type: "real_estate",
    category: "Apartments",
    sellPrice: 240000,
    roomCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: ["trans003"],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "9",
    name: "Country House with Land",
    description: "A large countryside home with surrounding farmland.",
    country: "Algeria",
    state: "Blida",
    city: "Blida",
    ownerId: "1009",
    ownerName: "Mohamed Bessa",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Houses",
    sellPrice: 160000,
    roomCount: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  },
  {
    _id: "10",
    name: "Luxury Penthouse with Rooftop Pool",
    description: "A high-end penthouse featuring a rooftop pool and stunning city views.",
    country: "Algeria",
    state: "Algiers",
    city: "Algiers",
    ownerId: "1010",
    ownerName: "Lina Cherif",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2340&q=80"
    ],
    status: "available",
    type: "real_estate",
    category: "Apartments",
    sellPrice: 500000,
    roomCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionIds: [],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: []
  }
];












export const mockTransactionsData = [
  {
    _id: "t1",
    payerId: "user1",
    payerName: "John Doe",
    receiverId: "owner1",
    receiverName: "Property Owner",
    propertyId: "prop1",
    propertyName: "Luxury Apartment",
    amount: 1200,
    currency: "USD",
    type: "rent",
    date: new Date("2023-12-01"),
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    _id: "t2",
    payerId: "user1",
    payerName: "John Doe",
    receiverId: "owner2",
    receiverName: "Hotel Manager",
    propertyId: "prop2",
    propertyName: "Seaside Resort",
    amount: 450,
    currency: "USD",
    type: "deposit",
    date: new Date("2023-11-15"),
    status: "completed",
    paymentMethod: "paypal",
  },
  {
    _id: "t3",
    payerId: "user1",
    payerName: "John Doe",
    receiverId: "owner3",
    receiverName: "Real Estate Agency",
    propertyId: "prop3",
    propertyName: "Downtown Condo",
    amount: 950,
    currency: "USD",
    type: "rent",
    date: new Date("2023-12-15"),
    status: "pending",
    paymentMethod: "bank_transfer",
  },
]

export const mockPropertiesData = [
  {
    _id: "prop1",
    name: "Luxury Apartment",
    description: "Modern 2-bedroom apartment with city view",
    country: "USA",
    state: "California",
    city: "Los Angeles",
    ownerId: "owner1",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "rented",
    type: "rented_real_estate",
    category: "apartment",
    rentPrice: 1200,
    leaseTerm: "long-term",
    roomCount: 2,
    createdAt: new Date("2023-01-15"),
    transactionIds: ["t1"],
    maintenanceRequestIds: ["m1"],
    leaseIds: ["l1"],
    bookingIds: [],
    ownerName: "Property Owner",
  },
  {
    _id: "prop2",
    name: "Seaside Resort",
    description: "Beachfront hotel room with ocean view",
    country: "USA",
    state: "Florida",
    city: "Miami",
    ownerId: "owner2",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "available",
    type: "hotel",
    category: "resort",
    rentPrice: 150,
    roomCount: 1,
    createdAt: new Date("2023-02-20"),
    transactionIds: ["t2"],
    maintenanceRequestIds: [],
    leaseIds: [],
    bookingIds: ["b1"],
    ownerName: "Hotel Manager",
  },
  {
    _id: "prop3",
    name: "Downtown Condo",
    description: "Modern condo in the heart of downtown",
    country: "USA",
    state: "New York",
    city: "New York",
    ownerId: "owner3",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "rented",
    type: "rented_real_estate",
    category: "condo",
    rentPrice: 950,
    leaseTerm: "long-term",
    roomCount: 1,
    createdAt: new Date("2023-03-10"),
    transactionIds: ["t3"],
    maintenanceRequestIds: [],
    leaseIds: ["l2"],
    bookingIds: [],
    ownerName: "Real Estate Agency",
  },
]

export const mockNotificationsData = [
  {
    _id: "n1",
    userId: "user1",
    title: "Rent Due Soon",
    description: "Your rent payment for Luxury Apartment is due in 3 days.",
    type: "warning",
    status: "unread",
    createdAt: new Date("2023-11-28"),
  },
  {
    _id: "n2",
    userId: "user1",
    title: "Booking Confirmed",
    description: "Your booking at Seaside Resort has been confirmed.",
    type: "success",
    status: "read",
    createdAt: new Date("2023-11-15"),
  },
  {
    _id: "n3",
    userId: "user1",
    title: "Maintenance Request Update",
    description: "Your maintenance request for Luxury Apartment is now in progress.",
    type: "info",
    status: "unread",
    createdAt: new Date("2023-11-20"),
  },
]

export const mockMaintenanceRequests = [
  {
    _id: "m1",
    propertyId: "prop1",
    clientId: "user1",
    description: "Leaking faucet in the bathroom",
    status: "in-progress",
    reportedAt: new Date("2023-11-18"),
  },
]

export const mockBookings = [
  {
    _id: "b1",
    propertyId: "prop2",
    clientId: "user1",
    checkInDate: new Date("2023-12-20"),
    checkOutDate: new Date("2023-12-25"),
    status: "confirmed",
    totalAmount: 750,
    bookedAt: new Date("2023-11-15"),
  },
]

export const mockLeases = [
  {
    _id: "l1",
    propertyId: "prop1",
    clientId: "user1",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    status: "active",
    rentAmount: 1200,
  },
  {
    _id: "l2",
    propertyId: "prop3",
    clientId: "user1",
    startDate: new Date("2023-03-15"),
    endDate: new Date("2024-03-14"),
    status: "active",
    rentAmount: 950,
  },
]


export const stateEncoder: Record<string, number> = {
  "Alabama": 1,
  "Alaska": 2,
  "Arizona": 3,
  "Arkansas": 4,
  "California": 5,
  "Colorado": 6,
  "Connecticut": 7,
  "Delaware": 8,
  "Florida": 9,
  "Georgia": 10,
  "Hawaii": 11,
  "Idaho": 12,
  "Illinois": 13,
  "Indiana": 14,
  "Iowa": 15,
  "Kansas": 16,
  "Kentucky": 17,
  "Louisiana": 18,
  "Maine": 19,
  "Maryland": 20,
  "Massachusetts": 21,
  "Michigan": 22,
  "Minnesota": 23,
  "Mississippi": 24,
  "Missouri": 25,
  "Montana": 26,
  "Nebraska": 27,
  "Nevada": 28,
  "New Hampshire": 29,
  "New Jersey": 30,
  "New Mexico": 31,
  "New York": 32,
  "North Carolina": 33,
  "North Dakota": 34,
  "Ohio": 35,
  "Oklahoma": 36,
  "Oregon": 37,
  "Pennsylvania": 38,
  "Rhode Island": 39,
  "South Carolina": 40,
  "South Dakota": 41,
  "Tennessee": 42,
  "Texas": 43,
  "Utah": 44,
  "Vermont": 45,
  "Virginia": 46,
  "Washington": 47,
  "West Virginia": 48,
  "Wisconsin": 49,
  "Wyoming": 50
};

