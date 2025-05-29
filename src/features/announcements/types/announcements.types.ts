export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'company' | 'facility' | 'urgent' | 'education';
  priority: 'high' | 'medium' | 'low';
  author: string;
  publishedAt: Date;
  readBy?: string[];
  attachments?: string[];
}

export interface Greeting {
  id: string;
  message: string;
  author: string;
  type: 'welcome' | 'appreciation' | 'motivation';
  publishedAt: Date;
}

export type AnnouncementType = 'all' | 'company' | 'facility' | 'education';
