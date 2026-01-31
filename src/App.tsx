import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExchangePage from './pages/ExchangePage';
import HistoryPage from './pages/HistoryPage';
import PublicRoute from './components/route/PublicRoute';
import ProtectedRoute from './components/route/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

