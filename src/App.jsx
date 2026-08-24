import { useCallback, useEffect, useState } from 'react';
import WelcomeLanding from './components/WelcomeLanding/WelcomeLanding';
import CheckinForm from './features/checkin/CheckinForm';
import ConfirmationScreen from './features/checkin/ConfirmationScreen';
import SuccessScreen from './features/checkin/SuccessScreen';
import DashboardPage from './features/dashboard/DashboardPage';
import ActivityDetailPage from './features/dashboard/ActivityDetailPage';
import ActivityListPage from './features/dashboard/ActivityListPage';
import DocumentsPage from './features/dashboard/DocumentsPage';
import TimelineInformation from './features/dashboard/TimelineInformation';
import AboutPage from './features/dashboard/AboutPage';
import ContactPage from './features/dashboard/ContactPage';
import YouthJourneyGame from './features/dashboard/YouthJourneyGame';
import { useCheckin } from './features/checkin/useCheckin';

const SCREENS = {
  WELCOME: 'welcome',
  FORM: 'form',
  CONFIRMATION: 'confirmation',
  SUCCESS: 'success',
  DASHBOARD: 'dashboard',
  DOCUMENTS: 'documents',
  PROGRAM: 'program',
  ABOUT: 'about',
  CONTACT: 'contact',
  GAME: 'game',
  ACTIVITY_LIST: 'activity-list',
  ACTIVITY_DETAIL: 'activity-detail',
};
const DELEGATE_SESSION_KEY = 'delegate-checkin-confirmation';

function getStoredDelegate() {
  try {
    return JSON.parse(window.sessionStorage.getItem(DELEGATE_SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function getScreenFromPath(pathname) {
  if (pathname === '/checkin') return SCREENS.FORM;
  if (pathname === '/confirmation') return SCREENS.CONFIRMATION;
  if (pathname === '/success') return SCREENS.SUCCESS;
  if (pathname === '/dashboard') return SCREENS.DASHBOARD;
  if (pathname === '/van-kien' || pathname === '/van-kien/') return SCREENS.DOCUMENTS;
  if (pathname === '/chuong-trinh' || pathname === '/chuong-trinh/') return SCREENS.PROGRAM;
  if (pathname === '/ve-chung-toi' || pathname === '/ve-chung-toi/') return SCREENS.ABOUT;
  if (pathname === '/lien-he-btc' || pathname === '/lien-he-btc/') return SCREENS.CONTACT;
  if (pathname === '/tro-choi' || pathname === '/tro-choi/') return SCREENS.GAME;
  if (pathname === '/activities' || pathname === '/activities/') return SCREENS.ACTIVITY_LIST;
  if (/^\/activities\/[^/]+\/?$/.test(pathname)) return SCREENS.ACTIVITY_DETAIL;
  return SCREENS.WELCOME;
}

function getActivityIdFromPath(pathname) {
  const match = pathname.match(/^\/activities\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function App() {
  const [screen, setScreen] = useState(() => getScreenFromPath(window.location.pathname));
  const [checkedInDelegate, setCheckedInDelegate] = useState(getStoredDelegate);
  const { form, saving, error, fieldErrors, updateField, submit, reset } = useCheckin();

  const navigateTo = useCallback((path, nextScreen) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setScreen(nextScreen);
  }, []);

  const navigateFromFooter = useCallback((sectionId) => {
    if (sectionId === 'documents') {
      navigateTo('/van-kien', SCREENS.DOCUMENTS);
      return;
    }

    if (sectionId === 'activities') {
      navigateTo('/activities', SCREENS.ACTIVITY_LIST);
      return;
    }

    if (sectionId === 'program') {
      navigateTo('/chuong-trinh', SCREENS.PROGRAM);
      return;
    }

    navigateTo('/dashboard', SCREENS.DASHBOARD);
  }, [navigateTo]);

  const navigateFromMoreMenu = useCallback((menuItemId) => {
    if (menuItemId === 'about') {
      navigateTo('/ve-chung-toi', SCREENS.ABOUT);
      return;
    }

    if (menuItemId === 'contact') {
      navigateTo('/lien-he-btc', SCREENS.CONTACT);
      return;
    }

    if (menuItemId === 'game') {
      navigateTo('/tro-choi', SCREENS.GAME);
      return;
    }

    if (menuItemId === 'end') {
      window.sessionStorage.removeItem(DELEGATE_SESSION_KEY);
      setCheckedInDelegate(null);
      reset();
      navigateTo('/', SCREENS.WELCOME);
    }
  }, [navigateTo, reset]);

  useEffect(() => {
    const handlePopState = () => setScreen(getScreenFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (
      ![
        SCREENS.CONFIRMATION,
        SCREENS.SUCCESS,
        SCREENS.DASHBOARD,
        SCREENS.DOCUMENTS,
        SCREENS.PROGRAM,
        SCREENS.ABOUT,
        SCREENS.CONTACT,
        SCREENS.GAME,
        SCREENS.ACTIVITY_LIST,
        SCREENS.ACTIVITY_DETAIL,
      ].includes(screen)
      || checkedInDelegate
    ) return;
    window.history.replaceState({}, '', '/checkin');
    setScreen(SCREENS.FORM);
  }, [checkedInDelegate, screen]);

  const handleSubmit = async () => {
    const savedDelegate = await submit();
    if (!savedDelegate) return false;

    setCheckedInDelegate(savedDelegate);
    window.sessionStorage.setItem(DELEGATE_SESSION_KEY, JSON.stringify(savedDelegate));
    navigateTo('/confirmation', SCREENS.CONFIRMATION);
    return true;
  };

  return (
      <main className={`app app--${screen}`}>
        {screen !== SCREENS.WELCOME && <><div className="ambient one" /><div className="ambient two" /></>}

        {screen === SCREENS.WELCOME && <WelcomeLanding onCheckIn={() => navigateTo('/checkin', SCREENS.FORM)} />}
        {screen === SCREENS.FORM && <CheckinForm form={form} saving={saving} error={error} fieldErrors={fieldErrors} onChange={updateField} onSubmit={handleSubmit} />}
        {screen === SCREENS.CONFIRMATION && checkedInDelegate && <ConfirmationScreen delegate={checkedInDelegate} onConfirm={() => navigateTo('/success', SCREENS.SUCCESS)} />}
        {screen === SCREENS.SUCCESS && checkedInDelegate && (
          <SuccessScreen
            delegate={checkedInDelegate}
            onEnter={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
          />
        )}
        {screen === SCREENS.DASHBOARD && checkedInDelegate && (
          <DashboardPage
            delegate={checkedInDelegate}
            onOpenActivity={(activityId) => (
              navigateTo(`/activities/${activityId}`, SCREENS.ACTIVITY_DETAIL)
            )}
            onOpenActivityList={() => navigateTo('/activities', SCREENS.ACTIVITY_LIST)}
            onOpenDocuments={() => navigateTo('/van-kien', SCREENS.DOCUMENTS)}
            onOpenProgram={() => navigateTo('/chuong-trinh', SCREENS.PROGRAM)}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.DOCUMENTS && checkedInDelegate && (
          <DocumentsPage
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onNavigateFooter={navigateFromFooter}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.PROGRAM && checkedInDelegate && (
          <TimelineInformation
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onNavigateFooter={navigateFromFooter}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.ABOUT && checkedInDelegate && (
          <AboutPage
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onNavigateFooter={navigateFromFooter}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.CONTACT && checkedInDelegate && (
          <ContactPage
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onNavigateFooter={navigateFromFooter}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.GAME && checkedInDelegate && (
          <YouthJourneyGame
            delegate={checkedInDelegate}
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onNavigateFooter={navigateFromFooter}
            onMenuAction={navigateFromMoreMenu}
          />
        )}
        {screen === SCREENS.ACTIVITY_LIST && checkedInDelegate && (
          <ActivityListPage
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
            onOpenActivity={(activityId) => (
              navigateTo(`/activities/${activityId}`, SCREENS.ACTIVITY_DETAIL)
            )}
          />
        )}
        {screen === SCREENS.ACTIVITY_DETAIL && checkedInDelegate && (
          <ActivityDetailPage
            activityId={getActivityIdFromPath(window.location.pathname)}
            onBack={() => navigateTo('/dashboard', SCREENS.DASHBOARD)}
          />
        )}
      </main>
  );
}
