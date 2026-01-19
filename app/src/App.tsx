import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  WelcomeScreen,
  HolidayListScreen,
  HolidayDetailScreen,
  AddHolidayScreen,
  ImportHolidaysScreen,
  BrowseHolidaysScreen,
  WidgetConfigScreen,
  LeavePlannerScreen,
} from './screens';
import { HolidaysProvider, useTelegram } from './context';

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component to handle Telegram back button
function TelegramBackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTelegram, showBackButton, hideBackButton, onBackButtonClick } = useTelegram();

  useEffect(() => {
    if (!isTelegram) return;

    // Show back button on all pages except root
    const isRootPath = location.pathname === '/' || location.pathname === '';
    
    if (isRootPath) {
      hideBackButton();
    } else {
      showBackButton();
    }

    // Handle back button click
    const cleanup = onBackButtonClick(() => {
      navigate(-1);
    });

    return cleanup;
  }, [isTelegram, location.pathname, navigate, showBackButton, hideBackButton, onBackButtonClick]);

  return null;
}

function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <HolidaysProvider>
        <ScrollToTop />
        <TelegramBackButtonHandler />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/holidays" element={<HolidayListScreen />} />
          <Route path="/holiday/:id" element={<HolidayDetailScreen />} />
          <Route path="/add" element={<AddHolidayScreen />} />
          <Route path="/edit/:id" element={<AddHolidayScreen />} />
          <Route path="/import" element={<ImportHolidaysScreen />} />
          <Route path="/browse" element={<BrowseHolidaysScreen />} />
          <Route path="/widget" element={<WidgetConfigScreen />} />
          <Route path="/leave-planner" element={<LeavePlannerScreen />} />
        </Routes>
      </HolidaysProvider>
    </MemoryRouter>
  );
}

export default App;
