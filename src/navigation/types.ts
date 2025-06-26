export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ClientTabParamList = {
  Home: undefined;
  Readings: undefined;
  Shop: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type ReaderTabParamList = {
  Dashboard: undefined;
  Sessions: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  AdminAuth: undefined;
  ClientTabs: undefined;
  ReaderTabs: undefined;
  AdminTabs: undefined;
  ReadingSession: {
    readerId: string;
    sessionType: 'chat' | 'phone' | 'video';
    mode?: 'instant' | 'scheduled';
    scheduledReadingId?: string;
  };
  ReadingTypes: undefined;
  ScheduleReading: {
    readingType: 'chat' | 'phone' | 'video';
    readerId?: string;
  };
  ChatReading: {
    readerId: string;
    mode: 'instant' | 'scheduled';
    scheduledReadingId?: string;
  };
  PhoneReading: {
    readerId: string;
    mode: 'instant' | 'scheduled';
    scheduledReadingId?: string;
  };
  AddFunds: undefined;
};