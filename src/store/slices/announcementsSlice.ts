import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Announcement {
  id: string;
  type: 'HEADQUARTERS' | 'FACILITY' | 'URGENT';
  category: 'POLICY' | 'EDUCATION' | 'SCHEDULE' | 'SAFETY' | 'OTHER';
  title: string;
  content: string;
  author: string;
  important: boolean;
  attachments: Array<{
    name: string;
    url: string;
    type: 'PDF' | 'IMAGE' | 'VIDEO';
  }>;
  createdAt: string;
  readCount: number;
  targetFacilities: string[];
  isRead: boolean;
  readAt?: string;
}

export interface AnnouncementsState {
  announcements: Announcement[];
  filteredAnnouncements: Announcement[];
  filterType: 'all' | 'headquarters' | 'facility' | 'unread' | 'important';
  selectedAnnouncement: Announcement | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const mockAnnouncements: Announcement[] = [
  {
    id: 'notice-001',
    type: 'HEADQUARTERS',
    category: 'POLICY',
    title: '요양보호사 근무 지침 개정 안내',
    content: '2025년 6월 1일부터 새로운 근무 지침이 적용됩니다. 주요 변경사항을 확인해주세요.',
    author: '본사 인사팀',
    important: true,
    attachments: [
      {
        name: '근무지침_개정안.pdf',
        url: 'https://cdn.carenote.com/notices/doc-001.pdf',
        type: 'PDF',
      },
    ],
    createdAt: '2025-05-25T09:00:00Z',
    readCount: 145,
    targetFacilities: ['all'],
    isRead: false,
  },
  {
    id: 'notice-002',
    type: 'FACILITY',
    category: 'EDUCATION',
    title: '6월 정기 교육 일정 안내',
    content: '6월 정기 교육 일정을 안내드립니다.',
    author: '교육팀',
    important: false,
    attachments: [],
    createdAt: '2025-05-28T14:00:00Z',
    readCount: 67,
    targetFacilities: ['facility-001'],
    isRead: true,
    readAt: '2025-05-28T15:30:00Z',
  },
  {
    id: 'notice-003',
    type: 'URGENT',
    category: 'SAFETY',
    title: '코로나19 방역 지침 강화',
    content: '최근 감염 확산에 따른 방역 지침이 강화되었습니다.',
    author: '방역팀',
    important: true,
    attachments: [],
    createdAt: '2025-05-29T08:00:00Z',
    readCount: 23,
    targetFacilities: ['all'],
    isRead: false,
  },
];

const initialState: AnnouncementsState = {
  announcements: mockAnnouncements,
  filteredAnnouncements: mockAnnouncements,
  filterType: 'all',
  selectedAnnouncement: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    size: 20,
    totalElements: mockAnnouncements.length,
    totalPages: 1,
  },
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<AnnouncementsState['filterType']>) => {
      state.filterType = action.payload;
      state.filteredAnnouncements = filterAnnouncements(state.announcements, action.payload, state.searchQuery);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredAnnouncements = filterAnnouncements(state.announcements, state.filterType, action.payload);
    },
    setSelectedAnnouncement: (state, action: PayloadAction<Announcement | null>) => {
      state.selectedAnnouncement = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const announcement = state.announcements.find(a => a.id === action.payload);
      if (announcement && !announcement.isRead) {
        announcement.isRead = true;
        announcement.readAt = new Date().toISOString();
        announcement.readCount += 1;
      }
    },
    addAnnouncement: (state, action: PayloadAction<Announcement>) => {
      state.announcements.unshift(action.payload);
      state.filteredAnnouncements = filterAnnouncements(state.announcements, state.filterType, state.searchQuery);
      state.pagination.totalElements += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<AnnouncementsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

// 헬퍼 함수
function filterAnnouncements(
  announcements: Announcement[],
  filterType: AnnouncementsState['filterType'],
  searchQuery: string
): Announcement[] {
  let filtered = announcements;

  // 타입별 필터링
  switch (filterType) {
    case 'headquarters':
      filtered = filtered.filter(a => a.type === 'HEADQUARTERS');
      break;
    case 'facility':
      filtered = filtered.filter(a => a.type === 'FACILITY');
      break;
    case 'unread':
      filtered = filtered.filter(a => !a.isRead);
      break;
    case 'important':
      filtered = filtered.filter(a => a.important);
      break;
  }

  // 검색어 필터링
  if (searchQuery) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}

export const {
  setFilterType,
  setSearchQuery,
  setSelectedAnnouncement,
  markAsRead,
  addAnnouncement,
  setLoading,
  setError,
  setPagination,
} = announcementsSlice.actions;

export default announcementsSlice.reducer;