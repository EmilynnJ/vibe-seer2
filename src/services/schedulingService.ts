import { ScheduledReading, TimeSlot, ReaderAvailability, ReadingPackage, ReadingRequest } from '../types/readings';

export class SchedulingService {
  private static instance: SchedulingService;
  
  public static getInstance(): SchedulingService {
    if (!SchedulingService.instance) {
      SchedulingService.instance = new SchedulingService();
    }
    return SchedulingService.instance;
  }

  // Get available time slots for a reader
  async getAvailableTimeSlots(
    readerId: string,
    readingType: 'chat' | 'phone' | 'video',
    startDate: Date,
    endDate: Date,
    duration: number = 30
  ): Promise<TimeSlot[]> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readerId,
          readingType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }

      const data = await response.json();
      return data.timeSlots.map((slot: any) => ({
        ...slot,
        date: new Date(slot.date)
      }));
    } catch (error) {
      console.error('Error fetching time slots:', error);
      
      // Return mock data for demonstration
      return this.getMockTimeSlots(readerId, readingType, startDate, endDate, duration);
    }
  }

  // Book a scheduled reading
  async bookScheduledReading(bookingData: {
    readerId: string;
    clientId: string;
    timeSlot: TimeSlot;
    packageId?: string;
    readingType: 'chat' | 'phone' | 'video';
    duration: number;
    price: number;
    specialRequests?: string;
    notes?: string;
  }): Promise<ScheduledReading> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to book reading');
      }

      const reading = await response.json();
      return {
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      };
    } catch (error) {
      console.error('Error booking reading:', error);
      
      // Return mock booking for demonstration
      return this.createMockBooking(bookingData);
    }
  }

  // Get scheduled readings for a user
  async getScheduledReadings(
    userId: string,
    userType: 'client' | 'reader',
    status?: string[]
  ): Promise<ScheduledReading[]> {
    try {
      const params = new URLSearchParams({
        userId,
        userType,
        ...(status && { status: status.join(',') })
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/scheduling/readings?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch scheduled readings');
      }

      const data = await response.json();
      return data.readings.map((reading: any) => ({
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching scheduled readings:', error);
      
      // Return mock data for demonstration
      return this.getMockScheduledReadings(userId, userType);
    }
  }

  // Reschedule a reading
  async rescheduleReading(
    readingId: string,
    newTimeSlot: TimeSlot,
    reason?: string
  ): Promise<ScheduledReading> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readingId,
          newTimeSlot,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule reading');
      }

      const reading = await response.json();
      return {
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      };
    } catch (error) {
      console.error('Error rescheduling reading:', error);
      throw error;
    }
  }

  // Cancel a scheduled reading
  async cancelReading(readingId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readingId,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reading');
      }
    } catch (error) {
      console.error('Error cancelling reading:', error);
      throw error;
    }
  }

  // Get reading packages for a reader
  async getReadingPackages(readerId: string): Promise<ReadingPackage[]> {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/readers/${readerId}/packages`,
        {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reading packages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching packages:', error);
      
      // Return mock packages for demonstration
      return this.getMockReadingPackages(readerId);
    }
  }

  // Set reader availability
  async setReaderAvailability(
    readerId: string,
    availability: Omit<ReaderAvailability, 'id' | 'readerId' | 'createdAt' | 'updatedAt'>[]
  ): Promise<ReaderAvailability[]> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readers/${readerId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ availability })
      });

      if (!response.ok) {
        throw new Error('Failed to set availability');
      }

      const data = await response.json();
      return data.availability.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
    } catch (error) {
      console.error('Error setting availability:', error);
      throw error;
    }
  }

  // Send reading request for instant reading
  async sendReadingRequest(requestData: {
    clientId: string;
    readerId: string;
    readingType: 'chat' | 'phone' | 'video';
    message?: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<ReadingRequest> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readings/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to send reading request');
      }

      const request = await response.json();
      return {
        ...request,
        createdAt: new Date(request.createdAt),
        expiresAt: new Date(request.expiresAt)
      };
    } catch (error) {
      console.error('Error sending reading request:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getAuthToken(): Promise<string> {
    // Get auth token from your auth store
    return 'auth-token';
  }

  private getMockTimeSlots(
    readerId: string,
    readingType: 'chat' | 'phone' | 'video',
    startDate: Date,
    endDate: Date,
    duration: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip weekends for this example
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Add morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          slots.push({
            id: `slot_${currentDate.getTime()}_${hour}`,
            readerId,
            date: new Date(currentDate),
            startTime: `${hour.toString().padStart(2, '0')}:00`,
            endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
            duration,
            isAvailable: Math.random() > 0.3, // 70% availability
            readingTypes: [readingType],
            price: readingType === 'chat' ? 79.99 : readingType === 'phone' ? 99.99 : 129.99
          });
        }
        
        // Add afternoon slots (2 PM - 6 PM)
        for (let hour = 14; hour < 18; hour++) {
          slots.push({
            id: `slot_${currentDate.getTime()}_${hour}`,
            readerId,
            date: new Date(currentDate),
            startTime: `${hour.toString().padStart(2, '0')}:00`,
            endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
            duration,
            isAvailable: Math.random() > 0.2, // 80% availability
            readingTypes: [readingType],
            price: readingType === 'chat' ? 79.99 : readingType === 'phone' ? 99.99 : 129.99
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots.filter(slot => slot.isAvailable);
  }

  private createMockBooking(bookingData: any): ScheduledReading {
    const now = new Date();
    return {
      id: `reading_${Date.now()}`,
      clientId: bookingData.clientId,
      readerId: bookingData.readerId,
      packageId: bookingData.packageId,
      readingType: bookingData.readingType,
      scheduledDate: bookingData.timeSlot.date,
      duration: bookingData.duration,
      price: bookingData.price,
      status: 'pending',
      timeZone: 'America/New_York',
      notes: bookingData.notes,
      specialRequests: bookingData.specialRequests,
      createdAt: now,
      updatedAt: now,
      clientName: 'John Doe',
      readerName: 'Sarah Moon',
      readerAvatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg'
    };
  }

  private getMockScheduledReadings(userId: string, userType: 'client' | 'reader'): ScheduledReading[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'reading_1',
        clientId: userType === 'client' ? userId : 'client_1',
        readerId: userType === 'reader' ? userId : 'reader_1',
        readingType: 'chat',
        scheduledDate: tomorrow,
        duration: 30,
        price: 79.99,
        status: 'confirmed',
        timeZone: 'America/New_York',
        notes: 'Looking for guidance on career path',
        createdAt: now,
        updatedAt: now,
        clientName: 'John Doe',
        readerName: 'Sarah Moon',
        readerAvatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg'
      },
      {
        id: 'reading_2',
        clientId: userType === 'client' ? userId : 'client_2',
        readerId: userType === 'reader' ? userId : 'reader_1',
        readingType: 'phone',
        scheduledDate: nextWeek,
        duration: 60,
        price: 159.99,
        status: 'pending',
        timeZone: 'America/New_York',
        notes: 'Relationship guidance needed',
        createdAt: now,
        updatedAt: now,
        clientName: 'Jane Smith',
        readerName: 'Sarah Moon',
        readerAvatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg'
      }
    ];
  }

  private getMockReadingPackages(readerId: string): ReadingPackage[] {
    return [
      {
        id: 'package_chat_basic',
        name: 'Chat Reading - 30 Min',
        description: 'Deep dive into your questions through detailed text conversation',
        duration: 30,
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        readingType: 'chat',
        features: [
          '30 minutes of focused chat',
          'Detailed written insights',
          'Card pulls with images',
          'Follow-up questions included',
          'Session transcript provided'
        ],
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'package_chat_extended',
        name: 'Chat Reading - 60 Min',
        description: 'Extended chat session for comprehensive guidance',
        duration: 60,
        price: 149.99,
        originalPrice: 179.99,
        discount: 17,
        readingType: 'chat',
        features: [
          '60 minutes of detailed chat',
          'Multiple topic exploration',
          'Tarot card spreads',
          'Personalized advice',
          'Session summary provided',
          'One follow-up message included'
        ],
        isAvailable: true
      },
      {
        id: 'package_phone_standard',
        name: 'Phone Reading - 30 Min',
        description: 'Personal voice connection for intuitive guidance',
        duration: 30,
        price: 99.99,
        readingType: 'phone',
        features: [
          '30 minutes of voice reading',
          'Direct spiritual connection',
          'Real-time card pulls',
          'Immediate answers',
          'Recording available'
        ],
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'package_phone_premium',
        name: 'Phone Reading - 60 Min',
        description: 'Comprehensive voice reading for life guidance',
        duration: 60,
        price: 189.99,
        originalPrice: 219.99,
        discount: 14,
        readingType: 'phone',
        features: [
          '60 minutes of voice guidance',
          'Multiple life areas covered',
          'Advanced tarot spreads',
          'Detailed predictions',
          'Full session recording',
          'Written summary included'
        ],
        isAvailable: true
      }
    ];
  }

  // Utility methods
  isTimeSlotAvailable(slot: TimeSlot, existingBookings: ScheduledReading[]): boolean {
    const slotStart = new Date(`${slot.date.toDateString()} ${slot.startTime}`);
    const slotEnd = new Date(`${slot.date.toDateString()} ${slot.endTime}`);

    return !existingBookings.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  }

  formatTimeSlot(slot: TimeSlot): string {
    const date = slot.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `${date} at ${slot.startTime}`;
  }

  calculatePackageDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  getNextAvailableSlot(slots: TimeSlot[]): TimeSlot | null {
    const now = new Date();
    const availableSlots = slots.filter(slot => {
      const slotTime = new Date(`${slot.date.toDateString()} ${slot.startTime}`);
      return slotTime > now && slot.isAvailable;
    });

    return availableSlots.length > 0 ? availableSlots[0] : null;
  }
}

export default SchedulingService;