export interface GlucoseReading {
  id: number | string;
  value: number;
  timeOfDay: string;
  mealContext: string;
  date: string;
  notes?: string;
}

export interface BloodPressureReading {
  id: number | string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timeOfDay: string;
  date: string;
  notes?: string;
}

export interface Medication {
  id: number | string;
  name: string;
  dosage: string;
  morning: boolean;
  evening: boolean;
  active: boolean;
}

export interface UploadedDocument {
  id: number | string;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  status: string;
  extracted: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  summary: string;
  date: string;
  source: string;
  readTime: string;
  content: string;
  bookmarked: boolean;
}
