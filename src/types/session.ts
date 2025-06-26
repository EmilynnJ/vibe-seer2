export interface ReadingSession {
  id: string;
  readerId: string;
  clientId: string;
  sessionType: 'chat' | 'phone' | 'video';
  status: 'waiting' | 'connecting' | 'active' | 'ended';
  startTime?: Date;
  endTime?: Date;
  totalMinutes?: number;
  ratePerMinute: number;
  totalCost?: number;
  readerName: string;
  clientName: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'client' | 'reader';
  message: string;
  timestamp: Date;
}