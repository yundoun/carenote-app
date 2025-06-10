export interface EducationMaterial {
  id: string;
  title: string;
  type: 'video' | 'document';
  duration: string;
  category: string;
  thumbnail: string;
  contentUrl?: string;
  progress?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  relatedToWork?: boolean;
}

export interface EducationCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

export type EducationTabType = 'recommended' | 'recent' | 'required';
