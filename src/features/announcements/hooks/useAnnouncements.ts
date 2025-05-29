import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setFilterType,
  setSearchQuery,
  setSelectedAnnouncement,
  markAsRead,
  addAnnouncement,
} from '@/store/slices/announcementsSlice';
import type { Announcement } from '@/store/slices/announcementsSlice';

export function useAnnouncements() {
  const dispatch = useAppDispatch();
  const {
    announcements,
    filteredAnnouncements,
    filterType,
    selectedAnnouncement,
    searchQuery,
    isLoading,
    error,
    pagination,
  } = useAppSelector((state) => state.announcements);

  const setFilter = useCallback((filter: typeof filterType) => {
    dispatch(setFilterType(filter));
  }, [dispatch]);

  const setSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const selectAnnouncement = useCallback((announcement: Announcement | null) => {
    dispatch(setSelectedAnnouncement(announcement));
    if (announcement && !announcement.isRead) {
      dispatch(markAsRead(announcement.id));
    }
  }, [dispatch]);

  const markAnnouncementAsRead = useCallback((id: string) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  const addNewAnnouncement = useCallback((announcement: Announcement) => {
    dispatch(addAnnouncement(announcement));
  }, [dispatch]);

  // 통계 계산
  const unreadCount = announcements.filter(a => !a.isRead).length;
  const urgentCount = announcements.filter(a => a.type === 'URGENT' && !a.isRead).length;
  const importantCount = announcements.filter(a => a.important && !a.isRead).length;
  const urgentAnnouncements = announcements.filter(a => a.type === 'URGENT' || a.important);

  // 기존 인터페이스와 호환성을 위한 greetings
  const greetings = [
    {
      id: '1',
      message: '안녕하세요! 오늘도 어르신들을 위한 따뜻한 마음으로 근무해주셔서 감사합니다. 💪',
      author: '원장',
      type: 'welcome' as const,
      publishedAt: new Date(),
    },
  ];

  return {
    announcements: filteredAnnouncements,
    allAnnouncements: announcements,
    greetings,
    urgentAnnouncements,
    filterType,
    selectedAnnouncement,
    searchQuery,
    isLoading,
    error,
    pagination,
    unreadCount,
    urgentCount,
    importantCount,
    setFilter,
    setSearch,
    selectAnnouncement,
    markAsRead: markAnnouncementAsRead,
    addAnnouncement: addNewAnnouncement,
  };
}