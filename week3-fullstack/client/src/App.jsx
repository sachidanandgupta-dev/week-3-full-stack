import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Tasks from './pages/Tasks.jsx';
import Images from './pages/Images.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/tasks' : '/login'} replace />} />
          <Route path="/login" element={user ? <Navigate to="/tasks" replace /> : <AuthPage mode="login" />} />
          <Route path="/register" element={user ? <Navigate to="/tasks" replace /> : <AuthPage mode="register" />} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/images" element={<ProtectedRoute><Images /></ProtectedRoute>} />
          <Route path="*" element={<p className="center">404 – Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}
