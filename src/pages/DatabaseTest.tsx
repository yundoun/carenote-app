import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResidentsService } from '@/services/residents.service';
import { AnnouncementsService } from '@/services/announcements.service';
import type { ResidentListItem } from '@/services/residents.service';

export function DatabaseTest() {
  const [testResults, setTestResults] = useState<{
    residentsTest: string;
    announcementsTest: string;
    connectionTest: string;
  }>({
    residentsTest: '테스트 준비 중...',
    announcementsTest: '테스트 준비 중...',
    connectionTest: '테스트 준비 중...',
  });

  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidentsForTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ResidentsService.getResidentList({
        page: 1,
        size: 5,
      });
      setResidents(response.data.content);
    } catch (err: any) {
      setError(err.message || '거주자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setTestResults((prev) => ({
        ...prev,
        connectionTest: '연결 테스트 중...',
      }));

      // 거주자 데이터 테스트
      const residentsResponse = await ResidentsService.getResidentList({
        page: 1,
        size: 3,
      });
      console.log('Residents response:', residentsResponse);

      setTestResults((prev) => ({
        ...prev,
        residentsTest: `✅ 거주자 데이터: ${residentsResponse.data.content.length}명 조회 성공`,
        connectionTest: '✅ 데이터베이스 연결 성공!',
      }));

      // 공지사항 데이터 테스트
      const announcementsResponse = await AnnouncementsService.getAnnouncements(
        { page: 1, size: 3 }
      );
      console.log('Announcements response:', announcementsResponse);

      setTestResults((prev) => ({
        ...prev,
        announcementsTest: `✅ 공지사항 데이터: ${announcementsResponse.data.content.length}건 조회 성공`,
      }));
    } catch (error) {
      console.error('Database test error:', error);
      setTestResults((prev) => ({
        ...prev,
        connectionTest: `❌ 연결 실패: ${error}`,
        residentsTest: '❌ 거주자 데이터 조회 실패',
        announcementsTest: '❌ 공지사항 데이터 조회 실패',
      }));
    }
  };

  useEffect(() => {
    testConnection();
    fetchResidentsForTest();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Supabase 데이터베이스 연결 테스트
        </h1>
        <Button onClick={testConnection}>다시 테스트</Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>연결 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{testResults.connectionTest}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>거주자 데이터 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{testResults.residentsTest}</p>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p className="text-red-500">에러: {error}</p>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium">조회된 거주자 목록:</h4>
                {residents.map((resident) => (
                  <div key={resident.id} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium">{resident.name}</p>
                    <p className="text-sm text-gray-600">
                      {resident.age}세 | {resident.room_number} |{' '}
                      {resident.care_level}
                    </p>
                    <p className="text-sm text-gray-500">
                      {resident.main_diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>공지사항 데이터 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{testResults.announcementsTest}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
