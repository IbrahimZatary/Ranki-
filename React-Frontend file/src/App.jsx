import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SubscriptionSelection from './pages/SubscriptionSelection';
import BusinessInfoForm from './pages/BusinessInfoForm';
import ScanningProgress from './pages/ScanningProgress';
import Dashboard from './pages/Dashboard';
import PastReports from './pages/PastReports';
import Settings from './pages/Settings';
import CustomCursor from './components/CustomCursor';
import NotFound from './pages/NotFound';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // For demo/development purposes, we might bypass token check or rely on it.
  // We'll keep the token check. If they register, token is set.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionSelection /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><BusinessInfoForm /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><ScanningProgress /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><PastReports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
