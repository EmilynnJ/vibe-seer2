// Simplified Session Service for React Native
import WebRTCService from './webrtcService';

export interface SessionRequest {
  sessionId: string;
  clientId: string;
  readerId: string;
  sessionType: 'chat' | 'phone' | 'video';
  ratePerMinute: number;
}

export interface SessionState {
  sessionId: string;
  status: 'pending' | 'active' | 'ended';
  participants: {
    client: { id: string; name: string; };
    reader: { id: string; name: string; };
  };
  sessionType: 'chat' | 'phone' | 'video';
  startTime?: Date;
  endTime?: Date;
  duration: number;
  cost: number;
}

export class SessionService {
  private static instance: SessionService;
  private webrtc: typeof WebRTCService;
  private currentSession: SessionState | null = null;

  private constructor() {
    this.webrtc = WebRTCService;
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // Request session
  async requestSession(request: SessionRequest): Promise<SessionState> {
    const session: SessionState = {
      sessionId: request.sessionId,
      status: 'pending',
      participants: {
        client: { id: request.clientId, name: 'Client' },
        reader: { id: request.readerId, name: 'Reader' }
      },
      sessionType: request.sessionType,
      duration: 0,
      cost: 0
    };

    this.currentSession = session;
    return session;
  }

  // Start session
  async startSession(sessionId: string): Promise<void> {
    if (this.currentSession && this.currentSession.sessionId === sessionId) {
      this.currentSession.status = 'active';
      this.currentSession.startTime = new Date();
    }
  }

  // End session
  async endSession(sessionId: string): Promise<void> {
    if (this.currentSession && this.currentSession.sessionId === sessionId) {
      this.currentSession.status = 'ended';
      this.currentSession.endTime = new Date();
    }
  }

  // Get current session
  getCurrentSession(): SessionState | null {
    return this.currentSession;
  }
}

export default SessionService.getInstance();