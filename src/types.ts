export type Tab = 'search' | 'notifications' | 'filters' | 'post-job' | 'preferences' | 'register';

export interface Notification {
  id: string;
  title: string;
  company: string;
  location: string;
  time: string;
  read: boolean;
  type: 'alert' | 'match' | 'view';
}

export interface FilterPreferences {
  keywords: string;
  location: string;
  jobType: string[];
  remote: boolean;
  salaryMin: number;
}
