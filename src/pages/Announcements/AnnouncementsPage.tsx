import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  GreetingsSection,
  UrgentAnnouncements,
  AnnouncementsTabs,
  AnnouncementDetail,
  useAnnouncements,
  Announcement,
} from '@/features/announcements';

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const { announcements, greetings, urgentAnnouncements, unreadCount } =
    useAnnouncements();

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <div className="text-right text-sm text-gray-500">
          <p>읽지 않은 공지: {unreadCount}개</p>
          <p>긴급 공지: {urgentAnnouncements.length}개</p>
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
