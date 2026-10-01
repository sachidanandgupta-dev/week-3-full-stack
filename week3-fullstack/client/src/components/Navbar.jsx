import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <strong>Task Manager</strong>
      <div className="links">
        {user ? (
          <>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/images">Images</NavLink>
            <span className="muted">Hi, {user.name}</span>
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
