import { Route, Routes } from 'react-router-dom';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/global.css';
import Homepage from 'src/pages/homepage'; // Default homepage component
import AdminPage from 'src/routes/sections'; // Admin page layout with routes
import ThemeProvider from 'src/theme';
import ReportPage from 'src/pages/report';
import Professorpage from 'src/pages/professor';

import StudentPage from './pages/student';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Routes>
        {/* Default route for Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Admin page route, containing child routes like blog, user, etc. */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/professor" element={<Professorpage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path= "/student" element={<StudentPage />} />
        
      </Routes>
    </ThemeProvider>
  );
}