import { useState, useEffect } from 'react';
import { Announcement, Greeting } from '../types/announcements.types';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [greetings, setGreetings] = useState<Greeting[]>([]);

  useEffect(() => {
    const loadMockData = () => {
      // Mock data for announcements
      setAnnouncements([
        {
          id: '1',
          title: '신규 안전 수칙 안내',
          content:
            '모든 요양보호사분들께 알려드립니다. 새로운 안전 수칙이 시행됩니다. 1) 어르신 이동 시 반드시 2인 1조로 진행 2) 낙상 위험 구역 재점검 3) 응급상황 대응 매뉴얼 숙지 필수. 자세한 내용은 첨부 파일을 확인해주세요.',
          type: 'company',
          priority: 'high',
          author: '본사 안전관리팀',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          attachments: ['안전수칙_가이드라인.pdf'],
        },
        {
          id: '2',
          title: '이번 주 교육 일정 안내',
          content:
            '이번 주 필수 교육 일정을 안내드립니다. 목요일 오후 2시 - 치매 케어 교육 (강의실 A), 금요일 오전 10시 - 응급처치 실습 (실습실). 참석 필수이며, 불참 시 사전 연락 바랍니다.',
          type: 'education',
          priority: 'medium',
          author: '교육팀',
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          title: '시설 내 Wi-Fi 점검 안내',
          content:
            '내일(1/16) 오전 9시부터 11시까지 시설 내 Wi-Fi 점검이 있습니다. 해당 시간 동안 인터넷 사용이 제한될 수 있으니 양해 부탁드립니다. 긴급 상황 시에는 유선 전화를 이용해주세요.',
          type: 'facility',
          priority: 'low',
          author: '시설관리팀',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
        {
          id: '4',
          title: '🚨 응급상황 발생 - 즉시 확인 요망',
          content:
            '2층 B유닛에서 응급상황이 발생했습니다. 모든 요양보호사는 즉시 해당 층으로 이동하여 지시에 따라 행동해주세요. 자세한 내용은 현장에서 안내드리겠습니다.',
          type: 'urgent',
          priority: 'high',
          author: '응급대응팀',
          publishedAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ]);

      // Mock data for greetings
      setGreetings([
        {
          id: '1',
          message:
            '안녕하세요, 김간호님! 오늘도 어르신들을 위한 따뜻한 마음으로 근무해주셔서 감사합니다. 건강하고 안전한 하루 되세요! 💪',
          author: '원장',
          type: 'welcome',
          publishedAt: new Date(),
        },
        {
          id: '2',
          message:
            '지난주 교육 참여율 100% 달성을 축하드립니다! 여러분의 열정적인 학습 자세가 더 나은 케어 서비스로 이어지고 있습니다. 👏',
          author: '교육팀장',
          type: 'appreciation',
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]);
    };

    loadMockData();
  }, []);

  const urgentAnnouncements = announcements.filter(
    (ann) => ann.priority === 'high' || ann.type === 'urgent'
  );
  const unreadCount = announcements.filter(
    (ann) => !ann.readBy?.includes('current_user')
  ).length;

  return {
    announcements,
    greetings,
    urgentAnnouncements,
    unreadCount,
  };
}
