import { useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';

export function useNavigation() {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const navigateToSchedule = () => navigateTo(ROUTES.SCHEDULE);
  const navigateToVitals = () => navigateTo(ROUTES.VITALS);
  const navigateToNursing = () => navigateTo(ROUTES.NURSING);
  const navigateToMyPage = () => navigateTo(ROUTES.MYPAGE);
  const navigateToResidents = () => navigateTo(ROUTES.RESIDENTS);
  const navigateToEducation = () => navigateTo(ROUTES.EDUCATION);
  const navigateToAnnouncements = () => navigateTo(ROUTES.ANNOUNCEMENTS);
  const navigateToSettings = () => navigateTo(ROUTES.SETTINGS);
  const navigateToHelp = () => navigateTo(ROUTES.HELP);
  const navigateToLogout = () => navigateTo(ROUTES.LOGOUT);
  const navigateToHome = () => navigateTo(ROUTES.HOME);

  return {
    navigateTo,
    navigateToSchedule,
    navigateToVitals,
    navigateToNursing,
    navigateToMyPage,
    navigateToResidents,
    navigateToEducation,
    navigateToAnnouncements,
    navigateToSettings,
    navigateToHelp,
    navigateToLogout,
    navigateToHome,
  };
}
