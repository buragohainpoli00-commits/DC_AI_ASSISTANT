export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isSuggested?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Admission' | 'Exam' | 'General' | 'Event';
  important?: boolean;
}

export interface Course {
  name: string;
  duration: string;
  eligibility: string;
}

export interface Department {
  name: string;
  head?: string;
  courses: Course[];
}
