export * from './components';
export * from './hooks';
// export * from './types/residents.types'; // 주석 처리하여 타입 충돌 방지

// Types - store의 타입을 사용
export { type ResidentDetail } from '@/store/slices/residentsSlice';

// Local types (필요한 경우만)
export type { ResidentTabType } from './types/residents.types';
