import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { ApiResponse, PagedResponse, AnnouncementType } from './api.types';

export type Announcement = Tables<'announcements'>;
export type AnnouncementAttachment = Tables<'announcement_attachments'>;

export interface AnnouncementListItem {
  id: string;
  type: AnnouncementType | null;
  category: string | null;
  title: string;
  content: string;
  author: string | null;
  important: boolean | null;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  created_at: string | null;
  read_count: number | null;
  target_facilities: string[] | null;
}

export interface AnnouncementDetail extends AnnouncementListItem {
  updated_at: string | null;
}

export class AnnouncementsService {
  // 공지사항 목록 조회
  static async getAnnouncements(params?: {
    type?: AnnouncementType;
    important?: boolean;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PagedResponse<AnnouncementListItem>>> {
    try {
      const { page = 1, size = 20, type, important } = params || {};
      const from = (page - 1) * size;
      const to = from + size - 1;

      let query = supabase
        .from('announcements')
        .select(
          `
          id,
          type,
          category,
          title,
          content,
          author,
          important,
          created_at,
          read_count,
          target_facilities,
          announcement_attachments (
            name,
            url
          )
        `
        )
        .order('created_at', { ascending: false })
        .range(from, to);

      if (type) {
        query = query.eq('type', type);
      }

      if (important !== undefined) {
        query = query.eq('important', important);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / size);

      const announcements: AnnouncementListItem[] = (data || []).map(
        (item) => ({
          id: item.id,
          type: item.type as AnnouncementType | null,
          category: item.category,
          title: item.title,
          content: item.content,
          author: item.author,
          important: item.important,
          attachments: item.announcement_attachments || [],
          created_at: item.created_at,
          read_count: item.read_count,
          target_facilities: item.target_facilities,
        })
      );

      return {
        code: 'SUCCESS',
        message: '공지사항 조회 성공',
        timestamp: new Date().toISOString(),
        data: {
          content: announcements,
          page: {
            size,
            number: page,
            totalElements,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw {
        code: 'ANNOUNCEMENT_001',
        message: '공지사항 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 공지사항 상세 조회
  static async getAnnouncementDetail(
    announcementId: string
  ): Promise<ApiResponse<AnnouncementDetail>> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(
          `
          *,
          announcement_attachments (
            name,
            url
          )
        `
        )
        .eq('id', announcementId)
        .single();

      if (error || !data) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }

      const announcement: AnnouncementDetail = {
        id: data.id,
        type: data.type as AnnouncementType | null,
        category: data.category,
        title: data.title,
        content: data.content,
        author: data.author,
        important: data.important,
        attachments: data.announcement_attachments || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        read_count: data.read_count,
        target_facilities: data.target_facilities,
      };

      return {
        code: 'SUCCESS',
        message: '공지사항 상세 조회 성공',
        timestamp: new Date().toISOString(),
        data: announcement,
      };
    } catch (error) {
      console.error('Error fetching announcement detail:', error);
      throw {
        code: 'ANNOUNCEMENT_002',
        message: '공지사항 상세 조회 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 공지사항 읽음 처리
  static async markAsRead(
    announcementId: string,
    userId: string
  ): Promise<ApiResponse<null>> {
    try {
      // 이미 읽음 처리되었는지 확인
      const { data: existingRead } = await supabase
        .from('announcement_reads')
        .select('id')
        .eq('announcement_id', announcementId)
        .eq('user_id', userId)
        .single();

      if (!existingRead) {
        // 읽음 기록 추가
        const { error: readError } = await supabase
          .from('announcement_reads')
          .insert({
            announcement_id: announcementId,
            user_id: userId,
          });

        if (readError) {
          throw readError;
        }

        // 읽음 수 업데이트
        const { data: currentData } = await supabase
          .from('announcements')
          .select('read_count')
          .eq('id', announcementId)
          .single();

        const newReadCount = (currentData?.read_count || 0) + 1;

        await supabase
          .from('announcements')
          .update({ read_count: newReadCount })
          .eq('id', announcementId);
      }

      return {
        code: 'SUCCESS',
        message: '공지사항 읽음 처리 완료',
        timestamp: new Date().toISOString(),
        data: null,
      };
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      throw {
        code: 'ANNOUNCEMENT_003',
        message: '공지사항 읽음 처리 실패',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
