import { io, Socket } from 'socket.io-client';

export interface LiveStream {
  id: string;
  readerId: string;
  readerName: string;
  readerAvatar?: string;
  title: string;
  description: string;
  category: string;
  viewers: number;
  isLive: boolean;
  startTime: Date;
  tags: string[];
  streamQuality: 'low' | 'medium' | 'high';
}

export interface StreamViewer {
  id: string;
  name: string;
  avatar?: string;
  joinTime: Date;
  totalGifts: number;
}

export interface VirtualGift {
  id: string;
  name: string;
  animation: string;
  cost: number;
  icon: string;
  description: string;
}

export interface GiftEvent {
  id: string;
  streamId: string;
  giftId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  quantity: number;
  totalValue: number;
  timestamp: Date;
  message?: string;
}

export interface StreamChat {
  id: string;
  streamId: string;
  senderId: string;
  senderName: string;
  senderType: 'viewer' | 'reader' | 'moderator';
  message: string;
  timestamp: Date;
  isHighlighted?: boolean;
}

export class LiveStreamService {
  private socket: Socket | null = null;
  private currentStream: LiveStream | null = null;
  private localStream: MediaStream | null = null;
  private viewers: StreamViewer[] = [];
  private chatMessages: StreamChat[] = [];
  private isStreaming: boolean = false;
  private isWatching: boolean = false;

  // Event handlers
  private onStreamStateChangeHandler: ((stream: LiveStream) => void) | null = null;
  private onViewerJoinHandler: ((viewer: StreamViewer) => void) | null = null;
  private onViewerLeaveHandler: ((viewerId: string) => void) | null = null;
  private onChatMessageHandler: ((message: StreamChat) => void) | null = null;
  private onGiftReceivedHandler: ((gift: GiftEvent) => void) | null = null;
  private onErrorHandler: ((error: string) => void) | null = null;

  constructor() {
    this.initializeSocketConnection();
  }

  private initializeSocketConnection() {
    this.socket = io(process.env.EXPO_PUBLIC_WS_URL || 'wss://api.soulseer.app', {
      transports: ['websocket'],
      path: '/live-streams'
    });

    this.socket.on('connect', () => {
    });


    this.socket.on('disconnect', () => {
    });


    // Stream events
    this.socket.on('stream-started', this.handleStreamStarted.bind(this));
    this.socket.on('stream-ended', this.handleStreamEnded.bind(this));
    this.socket.on('viewer-joined', this.handleViewerJoined.bind(this));
    this.socket.on('viewer-left', this.handleViewerLeft.bind(this));
    this.socket.on('stream-chat', this.handleStreamChat.bind(this));
    this.socket.on('gift-sent', this.handleGiftSent.bind(this));
    this.socket.on('stream-error', this.handleStreamError.bind(this));
  }

  // Stream creation and management
  async createStream(streamData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    quality: 'low' | 'medium' | 'high';
  }): Promise<LiveStream> {
    try {
      if (!this.socket) {
        throw new Error('Socket not connected');
      }

      const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const stream: LiveStream = {
        id: streamId,
        readerId: 'current-reader-id', // Get from auth store
        readerName: 'Current Reader', // Get from auth store
        title: streamData.title,
        description: streamData.description,
        category: streamData.category,
        viewers: 0,
        isLive: false,
        startTime: new Date(),
        tags: streamData.tags,
        streamQuality: streamData.quality
      };

      // Register stream with server
      this.socket.emit('create-stream', {
        streamId,
        streamData: stream
      });

      this.currentStream = stream;
      return stream;
    } catch (error) {
      this.handleError('Failed to create stream: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }

  async startStream(): Promise<void> {
    try {
      if (!this.currentStream) {
        throw new Error('No stream to start');
      }

      // Get user media for streaming
      const constraints = {
        video: {
          width: { ideal: this.currentStream.streamQuality === 'high' ? 1280 : 640 },
          height: { ideal: this.currentStream.streamQuality === 'high' ? 720 : 480 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Start streaming
      if (this.socket) {
        this.socket.emit('start-stream', {
          streamId: this.currentStream.id
        });
      }

      this.currentStream.isLive = true;
      this.isStreaming = true;

      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }

    } catch (error) {

      this.handleError('Failed to start stream: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }

  async endStream(): Promise<void> {
    try {
      if (!this.currentStream) {
        return;
      }

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // Notify server
      if (this.socket) {
        this.socket.emit('end-stream', {
          streamId: this.currentStream.id
        });
      }

      this.currentStream.isLive = false;
      this.isStreaming = false;

      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }

    } catch (error) {

      this.handleError('Failed to end stream: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Viewing streams
  async joinStream(streamId: string): Promise<LiveStream> {
    try {
      if (!this.socket) {
        throw new Error('Socket not connected');
      }

      // Join stream
      this.socket.emit('join-stream', { streamId });

      // Get stream data
      const streamData = await this.getStreamData(streamId);
      this.currentStream = streamData;
      this.isWatching = true;

      return streamData;
    } catch (error) {
      this.handleError('Failed to join stream: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }

  async leaveStream(): Promise<void> {
    try {
      if (!this.currentStream || !this.socket) {
        return;
      }

      this.socket.emit('leave-stream', {
        streamId: this.currentStream.id
      });

      this.isWatching = false;
      this.currentStream = null;
      this.viewers = [];
      this.chatMessages = [];

    } catch (error) {

      this.handleError('Failed to leave stream: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Chat functionality
  sendChatMessage(message: string): void {
    if (!this.currentStream || !this.socket) {
      throw new Error('No active stream');
    }

    const chatMessage: StreamChat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      streamId: this.currentStream.id,
      senderId: 'current-user-id', // Get from auth store
      senderName: 'Current User', // Get from auth store
      senderType: this.isStreaming ? 'reader' : 'viewer',
      message,
      timestamp: new Date()
    };

    this.socket.emit('stream-chat', chatMessage);
  }

  // Virtual gifting
  async sendGift(giftId: string, quantity: number = 1, message?: string): Promise<void> {
    try {
      if (!this.currentStream || !this.socket) {
        throw new Error('No active stream');
      }

      // Get gift data
      const gift = await this.getGiftData(giftId);
      const totalValue = gift.cost * quantity;

      // Process payment
      await this.processGiftPayment(totalValue);

      // Send gift
      const giftEvent: GiftEvent = {
        id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        streamId: this.currentStream.id,
        giftId,
        senderId: 'current-user-id', // Get from auth store
        senderName: 'Current User', // Get from auth store
        receiverId: this.currentStream.readerId,
        quantity,
        totalValue,
        timestamp: new Date(),
        message
      };

      this.socket.emit('send-gift', giftEvent);

    } catch (error) {

      this.handleError('Failed to send gift: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }

  // Data fetching
  private async getStreamData(streamId: string): Promise<LiveStream> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/streams/${streamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stream data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stream data:', error);
      throw error;
    }
  }

  private async getGiftData(giftId: string): Promise<VirtualGift> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/gifts/${giftId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gift data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching gift data:', error);
      throw error;
    }
  }

  private async processGiftPayment(amount: number): Promise<void> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/gift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing gift payment:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    // Get auth token from auth store
    return 'auth-token';
  }

  // Event handlers
  private handleStreamStarted(data: any) {
    if (this.currentStream) {

      this.currentStream.isLive = true;
      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }
    }
  }

  private handleStreamEnded(data: any) {
    if (this.currentStream) {

      this.currentStream.isLive = false;
      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }
    }
  }

  private handleViewerJoined(viewer: StreamViewer) {
    this.viewers.push(viewer);
    if (this.currentStream) {
      this.currentStream.viewers = this.viewers.length;
      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }
    }
    if (this.onViewerJoinHandler) {
      this.onViewerJoinHandler(viewer);
    }
  }

  private handleViewerLeft(data: { viewerId: string }) {
    this.viewers = this.viewers.filter(v => v.id !== data.viewerId);
    if (this.currentStream) {
      this.currentStream.viewers = this.viewers.length;
      if (this.onStreamStateChangeHandler) {
        this.onStreamStateChangeHandler(this.currentStream);
      }
    }
    if (this.onViewerLeaveHandler) {
      this.onViewerLeaveHandler(data.viewerId);
    }
  }

  private handleStreamChat(message: StreamChat) {
    this.chatMessages.push(message);
    if (this.onChatMessageHandler) {
      this.onChatMessageHandler(message);
    }
  }

  private handleGiftSent(gift: GiftEvent) {
    if (this.onGiftReceivedHandler) {
      this.onGiftReceivedHandler(gift);
    }
  }

  private handleStreamError(error: any) {
    this.handleError(error.message || 'Stream error occurred');
  }

  private handleError(error: string) {
    console.error('LiveStreamService error:', error);
    if (this.onErrorHandler) {
      this.onErrorHandler(error);
    }
  }

  // Event handler setters
  onStreamStateChange(handler: (stream: LiveStream) => void) {
    this.onStreamStateChangeHandler = handler;
  }

  onViewerJoin(handler: (viewer: StreamViewer) => void) {
    this.onViewerJoinHandler = handler;
  }

  onViewerLeave(handler: (viewerId: string) => void) {
    this.onViewerLeaveHandler = handler;
  }

  onChatMessage(handler: (message: StreamChat) => void) {
    this.onChatMessageHandler = handler;
  }

  onGiftReceived(handler: (gift: GiftEvent) => void) {
    this.onGiftReceivedHandler = handler;
  }

  onError(handler: (error: string) => void) {
    this.onErrorHandler = handler;
  }

  // Getters
  getCurrentStream(): LiveStream | null {
    return this.currentStream;
  }

  getViewers(): StreamViewer[] {
    return this.viewers;
  }

  getChatMessages(): StreamChat[] {
    return this.chatMessages;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  isCurrentlyStreaming(): boolean {
    return this.isStreaming;
  }

  isCurrentlyWatching(): boolean {
    return this.isWatching;
  }

  // Cleanup
  cleanup() {
    if (this.isStreaming) {
      this.endStream();
    }
    if (this.isWatching) {
      this.leaveStream();
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentStream = null;
    this.viewers = [];
    this.chatMessages = [];
    this.isStreaming = false;
    this.isWatching = false;
  }
}

export default LiveStreamService;