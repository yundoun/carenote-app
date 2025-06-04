import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnnouncementsService, type AnnouncementListItem } from '@/services/announcements.service';

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
    type?: 'PDF' | 'IMAGE' | 'VIDEO';
  }>;
  createdAt: string;
  readCount: number;
  targetFacilities: string[];
  isRead: boolean;
  readAt?: string;
}

// API 비동기 액션들
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (params?: {
    type?: 'HEADQUARTERS' | 'FACILITY' | 'URGENT';
    important?: boolean;
    page?: number;
    size?: number;
  }) => {
    const response = await AnnouncementsService.getAnnouncements(params);
    return response.data;
  }
);

export const fetchAnnouncementDetail = createAsyncThunk(
  'announcements/fetchAnnouncementDetail',
  async (announcementId: string) => {
    const response = await AnnouncementsService.getAnnouncementDetail(announcementId);
    return response.data;
  }
);

export const markAnnouncementAsRead = createAsyncThunk(
  'announcements/markAsRead',
  async ({ announcementId, userId }: { announcementId: string; userId: string }) => {
    await AnnouncementsService.markAsRead(announcementId, userId);
    return announcementId;
  }
);

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

// API 응답을 Redux 타입으로 변환하는 함수
function transformApiAnnouncement(apiAnnouncement: AnnouncementListItem): Announcement {
  return {
    id: apiAnnouncement.id,
    type: (apiAnnouncement.type as 'HEADQUARTERS' | 'FACILITY' | 'URGENT') || 'FACILITY',
    category: (apiAnnouncement.category as 'POLICY' | 'EDUCATION' | 'SCHEDULE' | 'SAFETY' | 'OTHER') || 'OTHER',
    title: apiAnnouncement.title,
    content: apiAnnouncement.content,
    author: apiAnnouncement.author || '',
    important: apiAnnouncement.important || false,
    attachments: apiAnnouncement.attachments || [],
    createdAt: apiAnnouncement.created_at || '',
    readCount: apiAnnouncement.read_count || 0,
    targetFacilities: apiAnnouncement.target_facilities || [],
    isRead: false, // 추후 읽음 상태 API와 연동
  };
}

const initialState: AnnouncementsState = {
  announcements: [],
  filteredAnnouncements: [],
  filterType: 'all',
  selectedAnnouncement: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    size: 20,
    totalElements: 0,
    totalPages: 0,
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
  extraReducers: (builder) => {
    builder
      // fetchAnnouncements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        const transformedAnnouncements = action.payload.content.map(transformApiAnnouncement);
        state.announcements = transformedAnnouncements;
        state.filteredAnnouncements = filterAnnouncements(transformedAnnouncements, state.filterType, state.searchQuery);
        state.pagination = action.payload.page;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '공지사항 조회에 실패했습니다.';
      })
      // fetchAnnouncementDetail
      .addCase(fetchAnnouncementDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAnnouncement = transformApiAnnouncement(action.payload);
      })
      .addCase(fetchAnnouncementDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '공지사항 상세 조회에 실패했습니다.';
      })
      // markAnnouncementAsRead
      .addCase(markAnnouncementAsRead.fulfilled, (state, action) => {
        const announcementId = action.payload;
        const announcement = state.announcements.find(a => a.id === announcementId);
        if (announcement && !announcement.isRead) {
          announcement.isRead = true;
          announcement.readAt = new Date().toISOString();
          announcement.readCount += 1;
        }
        if (state.selectedAnnouncement?.id === announcementId) {
          state.selectedAnnouncement.isRead = true;
          state.selectedAnnouncement.readAt = new Date().toISOString();
          state.selectedAnnouncement.readCount += 1;
        }
      });
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

// 비동기 액션들은 이미 위에서 export되었으므로 별도 export 불필요

export default announcementsSlice.reducer;