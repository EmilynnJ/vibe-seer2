export interface ReadingType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'instant' | 'scheduled';
  communicationType: 'chat' | 'phone' | 'video';
  minDuration?: number;
  maxDuration?: number;
  isAvailable: boolean;
}

export interface ReadingPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  originalPrice?: number;
  discount?: number;
  readingType: 'chat' | 'phone' | 'video';
  features: string[];
  isPopular?: boolean;
  isAvailable: boolean;
}

export interface ScheduledReading {
  id: string;
  clientId: string;
  readerId: string;
  packageId?: string;
  readingType: 'chat' | 'phone' | 'video';
  scheduledDate: Date;
  duration: number; // in minutes
  price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  timeZone: string;
  notes?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  clientName: string;
  readerName: string;
  readerAvatar?: string;
  paymentIntentId?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  endDate?: Date;
  maxOccurrences?: number;
  dayOfWeek?: number; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
}

export interface ReaderAvailability {
  id: string;
  readerId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timeZone: string;
  isAvailable: boolean;
  readingTypes: ('chat' | 'phone' | 'video')[];
  maxConcurrentSessions?: number;
  breakDuration?: number; // minutes between sessions
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  readerId: string;
  date: Date;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  isAvailable: boolean;
  readingTypes: ('chat' | 'phone' | 'video')[];
  price: number;
  isRecurring?: boolean;
}

export interface ReadingRequest {
  id: string;
  clientId: string;
  readerId: string;
  readingType: 'chat' | 'phone' | 'video';
  sessionType: 'instant' | 'scheduled';
  scheduledDate?: Date;
  duration?: number;
  packageId?: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ChatReading extends ScheduledReading {
  readingType: 'chat';
  maxMessages?: number;
  allowImages?: boolean;
  allowVoiceMessages?: boolean;
  typingIndicators?: boolean;
  messageHistory: ChatMessage[];
}

export interface PhoneReading extends ScheduledReading {
  readingType: 'phone';
  phoneNumber?: string;
  callQuality?: 'standard' | 'high';
  recordingEnabled?: boolean;
  callDuration?: number; // actual call duration
  callStartTime?: Date;
  callEndTime?: Date;
}

export interface InstantReading {
  id: string;
  clientId: string;
  readerId: string;
  readingType: 'chat' | 'phone' | 'video';
  ratePerMinute: number;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  totalCost: number;
  status: 'requesting' | 'connecting' | 'active' | 'paused' | 'ended';
  sessionId: string;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export interface ReadingPreferences {
  clientId: string;
  favoriteReaders: string[];
  preferredReadingTypes: ('chat' | 'phone' | 'video')[];
  preferredTimeSlots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  maxPricePerMinute: number;
  autoBooking: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminderMinutes: number[];
  };
  specialRequests: string[];
}

export interface ChatMessage {
  id: string;
  readingId: string;
  senderId: string;
  senderType: 'client' | 'reader' | 'system';
  messageType: 'text' | 'image' | 'voice' | 'system' | 'card_pull' | 'prediction';
  content: string;
  attachments?: {
    type: 'image' | 'voice' | 'card' | 'chart';
    url: string;
    caption?: string;
    metadata?: any;
  }[];
  timestamp: Date;
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string; // message ID
}

export interface ReadingNotes {
  id: string;
  readingId: string;
  readerId: string;
  clientId: string;
  notes: string;
  insights: string[];
  predictions: {
    category: string;
    prediction: string;
    timeframe?: string;
    confidence: 'low' | 'medium' | 'high';
  }[];
  cardsPulled?: {
    cardName: string;
    position: string;
    meaning: string;
    reversed?: boolean;
  }[];
  followUpRecommendations?: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingReview {
  id: string;
  readingId: string;
  clientId: string;
  readerId: string;
  rating: number; // 1-5
  reviewText?: string;
  categories: {
    accuracy: number;
    communication: number;
    empathy: number;
    overall: number;
  };
  isRecommended: boolean;
  isPublic: boolean;
  createdAt: Date;
  readerResponse?: {
    message: string;
    createdAt: Date;
  };
}