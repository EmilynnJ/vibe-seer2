// Simplified WebRTC Service for React Native
export interface ReadingSession {
  id: string;
  roomId: string;
  readerId: string;
  clientId: string;
  sessionType: 'chat' | 'phone' | 'video';
  status: 'connecting' | 'active' | 'ended' | 'failed';
  startTime?: Date;
  endTime?: Date;
  ratePerMinute: number;
  totalMinutes: number;
  totalCost: number;
  clientBalance: number;
}

export class WebRTCService {
  private static instance: WebRTCService;
  private currentSession: ReadingSession | null = null;
  private billingInterval: NodeJS.Timeout | null = null;
  private onSessionUpdateCallback: ((session: ReadingSession) => void) | null = null;

  private constructor() {}

  static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }

  // Start reading session
  async startReadingSession(sessionData: {
    readerId: string;
    clientId: string;
    sessionType: 'chat' | 'phone' | 'video';
    ratePerMinute: number;
    clientBalance: number;
  }): Promise<ReadingSession> {
    const roomId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      id: Date.now().toString(),
      roomId,
      readerId: sessionData.readerId,
      clientId: sessionData.clientId,
      sessionType: sessionData.sessionType,
      status: 'connecting',
      ratePerMinute: sessionData.ratePerMinute,
      totalMinutes: 0,
      totalCost: 0,
      clientBalance: sessionData.clientBalance
    };

    // Simulate connection
    setTimeout(() => {
      if (this.currentSession) {
        this.currentSession.status = 'active';
        this.currentSession.startTime = new Date();
        this.startBilling();
      }
    }, 2000);

    return this.currentSession;
  }

  // Start billing timer
  private startBilling(): void {
    if (!this.currentSession) return;

    this.billingInterval = setInterval(() => {
      this.processBilling();
    }, 15000); // Bill every 15 seconds
  }

  // Process billing
  private processBilling(): void {
    if (!this.currentSession || this.currentSession.status !== 'active') return;

    const incrementalCost = this.currentSession.ratePerMinute / 4; // 15-second increment
    
    if (this.currentSession.clientBalance < incrementalCost) {
      this.endSession('insufficient_balance');
      return;
    }

    this.currentSession.totalCost += incrementalCost;
    this.currentSession.clientBalance -= incrementalCost;
    this.currentSession.totalMinutes += 0.25; // 15 seconds = 0.25 minutes

    if (this.onSessionUpdateCallback) {
      this.onSessionUpdateCallback(this.currentSession);
    }
  }

  // End session
  endSession(reason: string = 'normal'): void {
    if (this.billingInterval) {
      clearInterval(this.billingInterval);
      this.billingInterval = null;
    }

    if (this.currentSession) {
      this.currentSession.status = 'ended';
      this.currentSession.endTime = new Date();
      
      if (this.onSessionUpdateCallback) {
        this.onSessionUpdateCallback(this.currentSession);
      }
    }

    this.currentSession = null;
  }

  // Get current session
  getCurrentSession(): ReadingSession | null {
    return this.currentSession;
  }

  // Set session update callback
  setOnSessionUpdate(callback: (session: ReadingSession) => void): void {
    this.onSessionUpdateCallback = callback;
  }

  // Media controls (simulated)
  toggleAudio(): boolean {
    return true;
  }

  toggleVideo(): boolean {
    return true;
  }

  // Get streams (simulated)
  getLocalStream(): MediaStream | null {
    return null;
  }

  getRemoteStream(): MediaStream | null {
    return null;
  }

  // Send chat message
  sendChatMessage(message: string): void {
  }

  // Check WebRTC support
  static checkWebRTCSupport(): boolean {
    return true;
  }
}

export default WebRTCService.getInstance();