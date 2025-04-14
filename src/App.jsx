import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import StoryPage from './pages/StoryPage';

// Protected pages
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateGamePage from './pages/game/CreateGamePage';
import GameDetailsPage from './pages/game/GameDetailsPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/story" element={<StoryPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game/create" 
            element={
              <ProtectedRoute>
                <CreateGamePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game/edit/:id" 
            element={
              <ProtectedRoute>
                <CreateGamePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game/:id" 
            element={
              <ProtectedRoute>
                <GameDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect /dashboard/* to /dashboard */}
          <Route 
            path="/dashboard/*" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;