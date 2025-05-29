// API 공통 응답 구조
export interface ApiResponse<T = any> {
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// 페이지네이션
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: PageInfo;
}

// 사용자 역할
export enum UserRole {
  CAREGIVER = 'CAREGIVER',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
}

// 근무 시간
export enum ShiftType {
  DAY = 'DAY',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

// 업무 상태
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// 케어 등급
export enum CareLevel {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3',
  LEVEL_4 = 'LEVEL_4',
  LEVEL_5 = 'LEVEL_5',
}

// 공지사항 타입
export enum AnnouncementType {
  HEADQUARTERS = 'HEADQUARTERS',
  FACILITY = 'FACILITY',
  URGENT = 'URGENT',
}

// 교육자료 타입
export enum EducationMaterialType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  QUIZ = 'QUIZ',
  INTERACTIVE = 'INTERACTIVE',
}
