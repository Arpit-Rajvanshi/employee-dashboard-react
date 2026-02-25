import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Page-level components ────────────────────────────
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDetails from './pages/EmployeeDetails';
import PhotoResult from './pages/PhotoResult';
import SalaryChart from './pages/SalaryChart';
import CityMap from './pages/CityMap';

/**
 * App Shell
 * ---------
 * Sets up the auth provider and client-side routing.
 * All routes except /login are wrapped in <ProtectedRoute>
 * so unauthenticated users get redirected automatically.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
          <Route path="/photo-result" element={<ProtectedRoute><PhotoResult /></ProtectedRoute>} />
          <Route path="/salary-chart" element={<ProtectedRoute><SalaryChart /></ProtectedRoute>} />
          <Route path="/city-map" element={<ProtectedRoute><CityMap /></ProtectedRoute>} />

          {/* Catch-all — redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
