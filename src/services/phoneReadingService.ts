// Simplified Phone Reading Service for React Native
export interface PhoneSession {
  id: string;
  readingId: string;
  readerName: string;
  clientName: string;
  status: 'requesting' | 'calling' | 'connected' | 'ended' | 'failed';
  duration: number;
  cost: number;
  ratePerMinute: number;
  startTime?: Date;
  endTime?: Date;
}

export class PhoneReadingService {
  private static instance: PhoneReadingService;
  private activeSessions: Map<string, PhoneSession> = new Map();

  private constructor() {}

  static getInstance(): PhoneReadingService {
    if (!PhoneReadingService.instance) {
      PhoneReadingService.instance = new PhoneReadingService();
    }
    return PhoneReadingService.instance;
  }

  // Start phone reading session
  async startPhoneReading(
    readerId: string,
    clientId: string,
    ratePerMinute: number
  ): Promise<PhoneSession> {
    const sessionId = `phone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: PhoneSession = {
      id: sessionId,
      readingId: `reading_${Date.now()}`,
      readerName: 'Reader',
      clientName: 'Client',
      status: 'requesting',
      duration: 0,
      cost: 0,
      ratePerMinute,
      startTime: new Date()
    };

    this.activeSessions.set(sessionId, session);

    // Simulate phone connection
    setTimeout(() => {
      const updatedSession = this.activeSessions.get(sessionId);
      if (updatedSession) {
        updatedSession.status = 'connected';
        this.activeSessions.set(sessionId, updatedSession);
      }
    }, 3000);

    return session;
  }

  // End phone session
  endPhoneSession(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      session.endTime = new Date();
      this.activeSessions.set(sessionId, session);
    }
  }

  // Get active sessions
  getActiveSessions(): PhoneSession[] {
    return Array.from(this.activeSessions.values());
  }

  // Get session by ID
  getSession(sessionId: string): PhoneSession | undefined {
    return this.activeSessions.get(sessionId);
  }
}

export default PhoneReadingService.getInstance();