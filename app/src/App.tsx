import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  WelcomeScreen,
  HolidayListScreen,
  HolidayDetailScreen,
  AddHolidayScreen,
  ImportHolidaysScreen,
  BrowseHolidaysScreen,
  WidgetConfigScreen,
} from './screens';

function App() {
  return (
    <BrowserRouter basename="/calendar-countdown-vite">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/holidays" element={<HolidayListScreen />} />
        <Route path="/holiday/:id" element={<HolidayDetailScreen />} />
        <Route path="/add" element={<AddHolidayScreen />} />
        <Route path="/edit/:id" element={<AddHolidayScreen />} />
        <Route path="/import" element={<ImportHolidaysScreen />} />
        <Route path="/browse" element={<BrowseHolidaysScreen />} />
        <Route path="/widget" element={<WidgetConfigScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
