export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface AdminStats {
  users: {
    totalUsers: number;
    totalClients: number;
    totalReaders: number;
    newUsers30d: number;
  };
  sessions: {
    totalSessions: number;
    completedSessions: number;
    sessionsToday: number;
    avgSessionLength: number;
  };
  revenue: {
    totalRevenue: number;
    revenueToday: number;
    revenue30d: number;
  };
}

export interface AdminReader {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialties: string[];
  chatRate: number;
  phoneRate: number;
  videoRate: number;
  isAvailable: boolean;
  isOnline: boolean;
  totalEarnings: number;
  pendingEarnings: number;
  rating: number;
  totalReviews: number;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  stripeAccountId?: string;
  createdAt: string;
}

export interface AdminClient {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  totalSpent: number;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  sessionType: 'chat' | 'phone' | 'video';
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  ratePerMinute: number;
  startTime?: string;
  endTime?: string;
  totalMinutes: number;
  totalCost: number;
  readerFirstName: string;
  readerLastName: string;
  clientFirstName: string;
  clientLastName: string;
  createdAt: string;
}

export interface CreateReaderData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialties: string[];
  chatRate: number;
  phoneRate: number;
  videoRate: number;
}

export interface AdminState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  stats: AdminStats | null;
  readers: AdminReader[];
  clients: AdminClient[];
  activeSessions: AdminSession[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadStats: () => Promise<void>;
  loadReaders: () => Promise<void>;
  loadClients: () => Promise<void>;
  loadActiveSessions: () => Promise<void>;
  createReader: (data: CreateReaderData) => Promise<void>;
  updateReader: (userId: string, updates: Partial<AdminReader>) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  refundClient: (userId: string, amount: number, reason: string) => Promise<void>;
}