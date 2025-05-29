import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnouncementCard } from '../AnnouncementCard/AnnouncementCard';
import {
  Announcement,
  AnnouncementType,
} from '../../types/announcements.types';

interface AnnouncementsTabsProps {
  announcements: Announcement[];
  onAnnouncementClick: (announcement: Announcement) => void;
}

export function AnnouncementsTabs({
  announcements,
  onAnnouncementClick,
}: AnnouncementsTabsProps) {
  const getFilteredAnnouncements = (type: AnnouncementType) => {
    if (type === 'all') {
      return announcements;
    }
    return announcements.filter((ann) => ann.type === type);
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="company">본사</TabsTrigger>
        <TabsTrigger value="facility">시설</TabsTrigger>
        <TabsTrigger value="education">교육</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0 space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
          />
        ))}
      </TabsContent>

      <TabsContent value="company" className="mt-0 space-y-4">
        {getFilteredAnnouncements('company').map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
          />
        ))}
      </TabsContent>

      <TabsContent value="facility" className="mt-0 space-y-4">
        {getFilteredAnnouncements('facility').map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
          />
        ))}
      </TabsContent>

      <TabsContent value="education" className="mt-0 space-y-4">
        {getFilteredAnnouncements('education').map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
