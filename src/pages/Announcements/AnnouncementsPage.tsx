import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import {
  GreetingsSection,
  UrgentAnnouncements,
  AnnouncementsTabs,
  AnnouncementDetail,
  useAnnouncements,
  Announcement,
} from '@/features/announcements';

// Redux store의 Announcement를 features/announcements의 Announcement로 변환
const convertToFeatureAnnouncement = (storeAnnouncement: any): Announcement => {
  // type 변환: HEADQUARTERS/FACILITY/URGENT -> company/facility/urgent
  const typeMap: Record<string, 'company' | 'facility' | 'urgent'> = {
    HEADQUARTERS: 'company',
    FACILITY: 'facility',
    URGENT: 'urgent',
  };

  // priority 결정: important가 true면 high, URGENT면 high, 나머지는 medium
  const priority =
    storeAnnouncement.important || storeAnnouncement.type === 'URGENT'
      ? ('high' as const)
      : ('medium' as const);

  return {
    id: storeAnnouncement.id,
    title: storeAnnouncement.title,
    content: storeAnnouncement.content,
    type: typeMap[storeAnnouncement.type] || 'company',
    priority,
    author: storeAnnouncement.author,
    publishedAt: new Date(storeAnnouncement.createdAt),
    readBy: storeAnnouncement.isRead ? ['current-user'] : [],
    attachments:
      storeAnnouncement.attachments?.map((att: any) => att.url) || [],
  };
};

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const {
    announcements: storeAnnouncements,
    greetings,
    urgentAnnouncements: storeUrgentAnnouncements,
    unreadCount,
    isLoading,
    error,
    refreshAnnouncements,
  } = useAnnouncements();

  // Redux store의 데이터를 features/announcements 타입으로 변환
  const announcements = storeAnnouncements.map(convertToFeatureAnnouncement);
  const urgentAnnouncements = storeUrgentAnnouncements.map(
    convertToFeatureAnnouncement
  );

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleRefresh = () => {
    refreshAnnouncements();
  };

  if (isLoading && storeAnnouncements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="w-64 space-y-2">
          <p className="text-sm text-gray-600 text-center">공지사항을 불러오는 중...</p>
          <Progress value={undefined} className="h-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">오류가 발생했습니다</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            새로고침
          </Button>
          <div className="text-right text-sm text-gray-500">
            <p>읽지 않은 공지: {unreadCount}개</p>
            <p>긴급 공지: {urgentAnnouncements.length}개</p>
          </div>
        </div>
      </div>

      <GreetingsSection greetings={greetings} />

      <UrgentAnnouncements
        urgentAnnouncements={urgentAnnouncements}
        onAnnouncementClick={handleAnnouncementClick}
      />

      <AnnouncementsTabs
        announcements={announcements}
        onAnnouncementClick={handleAnnouncementClick}
      />

      {/* Announcement Detail Dialog */}
      <Dialog
        open={!!selectedAnnouncement}
        onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <AnnouncementDetail announcement={selectedAnnouncement} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
