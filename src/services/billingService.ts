import { Stripe } from '@stripe/stripe-js';

export interface BillingSession {
  sessionId: string;
  clientId: string;
  readerId: string;
  ratePerMinute: number;
  startTime: Date;
  endTime?: Date;
  totalMinutes: number;
  totalCost: number;
  paymentIntentId?: string;
  status: 'active' | 'paused' | 'ended' | 'error';
}

export interface BillingEvent {
  type: 'session_started' | 'minute_charged' | 'session_paused' | 'session_resumed' | 'session_ended' | 'balance_low' | 'payment_failed';
  sessionId: string;
  timestamp: Date;
  amount?: number;
  balance?: number;
  error?: string;
}

export class BillingService {
  private stripe: Stripe | null = null;
  private activeSessions: Map<string, BillingSession> = new Map();
  private billingTimers: Map<string, any> = new Map();
  private eventHandlers: Map<string, (event: BillingEvent) => void> = new Map();

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error('Stripe publishable key not found');
      }

      // Initialize Stripe
      const { loadStripe } = await import('@stripe/stripe-js');
      this.stripe = await loadStripe(stripeKey);

      if (!this.stripe) {
        throw new Error('Failed to initialize Stripe');
      }

    } catch (error) {

      console.error('Error initializing Stripe:', error);
      throw error;
    }
  }

  async startBillingSession(
    sessionId: string,
    clientId: string,
    readerId: string,
    ratePerMinute: number
  ): Promise<BillingSession> {
    try {
      // Check client balance first
      const clientBalance = await this.getClientBalance(clientId);
      if (clientBalance < ratePerMinute) {
        throw new Error('Insufficient balance for this session');
      }

      // Create billing session
      const session: BillingSession = {
        sessionId,
        clientId,
        readerId,
        ratePerMinute,
        startTime: new Date(),
        totalMinutes: 0,
        totalCost: 0,
        status: 'active'
      };

      this.activeSessions.set(sessionId, session);

      // Start billing timer (charge every minute)
      const timer = setInterval(() => {
        this.processBillingCycle(sessionId);
      }, 60000); // 60 seconds = 1 minute

      this.billingTimers.set(sessionId, timer);

      // Emit session started event
      this.emitEvent({
        type: 'session_started',
        sessionId,
        timestamp: new Date(),
        amount: ratePerMinute
      });

      return session;

    } catch (error) {
      console.error('Error starting billing session:', error);
      throw error;
    }
  }

  private async processBillingCycle(sessionId: string) {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.status !== 'active') {
      return;
    }

    try {
      // Check client balance
      const clientBalance = await this.getClientBalance(session.clientId);

      if (clientBalance < session.ratePerMinute) {
        // Insufficient balance - end session
        await this.endBillingSession(sessionId, 'insufficient_balance');
        return;
      }

      // Charge for this minute
      const chargeAmount = session.ratePerMinute;
      await this.chargeClient(session.clientId, chargeAmount, sessionId);

      // Update session
      session.totalMinutes += 1;
      session.totalCost += chargeAmount;

      // Update reader earnings
      await this.updateReaderEarnings(session.readerId, chargeAmount * 0.7); // 70% to reader

      // Emit minute charged event
      this.emitEvent({
        type: 'minute_charged',
        sessionId,
        timestamp: new Date(),
        amount: chargeAmount,
        balance: clientBalance - chargeAmount
      });



      // Check for low balance warning
      const newBalance = clientBalance - chargeAmount;
      if (newBalance < session.ratePerMinute * 2) { // Less than 2 minutes remaining
        this.emitEvent({
          type: 'balance_low',
          sessionId,
          timestamp: new Date(),
          balance: newBalance
        });
      }

    } catch (error) {
      console.error('Error processing billing cycle:', error);

      // Emit payment failed event
      this.emitEvent({
        type: 'payment_failed',
        sessionId,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Payment failed'
      });

      // Pause session on payment failure
      await this.pauseBillingSession(sessionId);
    }
  }

  async pauseBillingSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Clear billing timer
    const timer = this.billingTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.billingTimers.delete(sessionId);
    }

    // Update session status
    session.status = 'paused';

    // Emit session paused event
    this.emitEvent({
      type: 'session_paused',
      sessionId,
      timestamp: new Date()
    });

  }


  async resumeBillingSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check client balance
    const clientBalance = await this.getClientBalance(session.clientId);
    if (clientBalance < session.ratePerMinute) {
      throw new Error('Insufficient balance to resume session');
    }

    // Resume billing timer
    const timer = setInterval(() => {
      this.processBillingCycle(sessionId);
    }, 60000);

    this.billingTimers.set(sessionId, timer);

    // Update session status
    session.status = 'active';

    // Emit session resumed event
    this.emitEvent({
      type: 'session_resumed',
      sessionId,
      timestamp: new Date()
    });

  }


  async endBillingSession(sessionId: string, reason?: string): Promise<BillingSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Clear billing timer
    const timer = this.billingTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.billingTimers.delete(sessionId);
    }

    // Update session
    session.endTime = new Date();
    session.status = 'ended';

    // Save session to database
    await this.saveSessionToDatabase(session);

    // Remove from active sessions
    this.activeSessions.delete(sessionId);

    // Emit session ended event
    this.emitEvent({
      type: 'session_ended',
      sessionId,
      timestamp: new Date(),
      amount: session.totalCost
    });

    return session;

  }

  private async chargeClient(clientId: string, amount: number, sessionId: string): Promise<void> {
    try {
      // In production, this would call your backend API to process the charge
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/billing/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          clientId,
          amount,
          sessionId,
          currency: 'usd',
          description: `SoulSeer reading session ${sessionId}`
        })
      });

      if (!response.ok) {
        throw new Error(`Charge failed: ${response.statusText}`);
      }

      const result = await response.json();
    } catch (error) {

      console.error('Error charging client:', error);
      throw error;
    }
  }

  private async updateReaderEarnings(readerId: string, amount: number): Promise<void> {
    try {
      // Update reader earnings in database
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readers/${readerId}/earnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error(`Failed to update reader earnings: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating reader earnings:', error);
      throw error;
    }
  }

  private async getClientBalance(clientId: string): Promise<number> {
    try {
      // Get client balance from database
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/clients/${clientId}/balance`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get client balance: ${response.statusText}`);
      }

      const result = await response.json();
      return result.balance;
    } catch (error) {
      console.error('Error getting client balance:', error);
      // Return 0 as fallback
      return 0;
    }
  }

  private async saveSessionToDatabase(session: BillingSession): Promise<void> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          clientId: session.clientId,
          readerId: session.readerId,
          ratePerMinute: session.ratePerMinute,
          startTime: session.startTime,
          endTime: session.endTime,
          totalMinutes: session.totalMinutes,
          totalCost: session.totalCost,
          paymentIntentId: session.paymentIntentId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save session: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving session to database:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    // Get auth token from your auth store
    return 'auth-token';
  }

  private emitEvent(event: BillingEvent) {
    const handler = this.eventHandlers.get(event.sessionId);
    if (handler) {
      handler(event);
    }

    // Also emit to global handler if exists
    const globalHandler = this.eventHandlers.get('global');
    if (globalHandler) {
      globalHandler(event);
    }
  }

  // Public methods for event handling
  onBillingEvent(sessionId: string, handler: (event: BillingEvent) => void) {
    this.eventHandlers.set(sessionId, handler);
  }

  onGlobalBillingEvent(handler: (event: BillingEvent) => void) {
    this.eventHandlers.set('global', handler);
  }

  removeEventHandler(sessionId: string) {
    this.eventHandlers.delete(sessionId);
  }

  // Getters
  getBillingSession(sessionId: string): BillingSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  getActiveSessions(): BillingSession[] {
    return Array.from(this.activeSessions.values());
  }

  isSessionActive(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    return session?.status === 'active' || false;
  }

  getSessionDuration(sessionId: string): number {
    const session = this.activeSessions.get(sessionId);
    if (!session) return 0;

    const endTime = session.endTime || new Date();
    return Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
  }

  getSessionCost(sessionId: string): number {
    const session = this.activeSessions.get(sessionId);
    return session?.totalCost || 0;
  }

  // Cleanup
  cleanup() {
    // Clear all timers
    this.billingTimers.forEach(timer => clearInterval(timer));
    this.billingTimers.clear();

    // Clear sessions
    this.activeSessions.clear();

    // Clear event handlers
    this.eventHandlers.clear();
  }
}

// Fix: Ensure tsconfig.json has the correct module flag for dynamic imports
// If using dynamic import(), set "module": "esnext" or a compatible value in tsconfig.json

export default BillingService;