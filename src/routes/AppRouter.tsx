import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { SchedulePage } from '@/pages/Schedule/SchedulePage';
import { VitalsPage } from '@/pages/VitalPage/VitalPage';
import NursingPage from '@/pages/Nursing/NursingPage';
import { MyPage } from '@/pages/My/MyPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import { DatabaseTest } from '@/pages/DatabaseTest';
import { ROUTES } from './routes';
import EducationPage from '@/pages/Education/EducationPage';
import AnnouncementsPage from '@/pages/Announcements/AnnouncementsPage';
import ResidentsPage from '@/pages/Residents/ResidentsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* 홈 페이지 */}
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* 메인 페이지들 */}
      <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
      <Route path={ROUTES.VITALS} element={<VitalsPage />} />
      <Route path={ROUTES.NURSING} element={<NursingPage />} />
      <Route path={ROUTES.MYPAGE} element={<MyPage />} />

      {/* 추가 페이지들 */}
      <Route path={ROUTES.RESIDENTS} element={<ResidentsPage />} />
      <Route path={ROUTES.EDUCATION} element={<EducationPage />} />
      <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      <Route path={ROUTES.HELP} element={<div>도움말 페이지</div>} />
      <Route path={ROUTES.LOGOUT} element={<div>로그아웃 처리</div>} />

      {/* 데이터베이스 테스트 페이지 */}
      <Route path="/database-test" element={<DatabaseTest />} />

      {/* 404 페이지 - 존재하지 않는 경로는 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
