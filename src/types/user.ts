export interface User {
  id: string;
  email: string;
  role: 'client' | 'reader' | 'admin';
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  isOnline?: boolean;
}

export interface Reader extends User {
  role: 'reader';
  bio: string;
  specialties: string[];
  rating: number;
  totalReviews: number;
  chatRate: number; // per minute
  phoneRate: number; // per minute
  videoRate: number; // per minute
  isAvailable: boolean;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface Client extends User {
  role: 'client';
  balance: number;
  totalSpent: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'client';
}