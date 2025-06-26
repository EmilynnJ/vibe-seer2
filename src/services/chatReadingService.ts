// Simplified Chat Reading Service for React Native
export interface ChatReading {
  id: string;
  readerId: string;
  clientId: string;
  status: 'pending' | 'active' | 'ended';
  messages: ChatMessage[];
  startTime?: Date;
  endTime?: Date;
  cost: number;
  ratePerMinute: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'client' | 'reader';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
}

export class ChatReadingService {
  private static instance: ChatReadingService;
  private activeReadings: Map<string, ChatReading> = new Map();

  private constructor() {}

  static getInstance(): ChatReadingService {
    if (!ChatReadingService.instance) {
      ChatReadingService.instance = new ChatReadingService();
    }
    return ChatReadingService.instance;
  }

  // Start chat reading
  async startChatReading(
    readerId: string,
    clientId: string,
    ratePerMinute: number
  ): Promise<ChatReading> {
    const readingId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const reading: ChatReading = {
      id: readingId,
      readerId,
      clientId,
      status: 'pending',
      messages: [],
      startTime: new Date(),
      cost: 0,
      ratePerMinute
    };

    this.activeReadings.set(readingId, reading);
    return reading;
  }

  // Send message
  async sendMessage(
    readingId: string,
    senderId: string,
    senderType: 'client' | 'reader',
    content: string,
    type: 'text' | 'image' | 'voice' = 'text'
  ): Promise<ChatMessage> {
    const reading = this.activeReadings.get(readingId);
    if (!reading) {
      throw new Error('Reading not found');
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      senderType,
      content,
      timestamp: new Date(),
      type
    };

    reading.messages.push(message);
    this.activeReadings.set(readingId, reading);

    return message;
  }

  // End chat reading
  endChatReading(readingId: string): void {
    const reading = this.activeReadings.get(readingId);
    if (reading) {
      reading.status = 'ended';
      reading.endTime = new Date();
      this.activeReadings.set(readingId, reading);
    }
  }

  // Get reading by ID
  getReading(readingId: string): ChatReading | undefined {
    return this.activeReadings.get(readingId);
  }

  // Get all messages for a reading
  getMessages(readingId: string): ChatMessage[] {
    const reading = this.activeReadings.get(readingId);
    return reading ? reading.messages : [];
  }
}

export default ChatReadingService.getInstance();