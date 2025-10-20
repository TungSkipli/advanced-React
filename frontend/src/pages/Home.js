import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Advanced React App</h1>
        
        {isAuthenticated ? (
          <div className="home-authenticated">
            <p className="home-greeting">Hello, {user?.displayName || user?.email}!</p>
            <div className="home-buttons">
              <Link to="/profile" className="home-btn primary">
                View Profile
              </Link>
              <Link to="/comments" className="home-btn secondary">
                Go to Comments
              </Link>
            </div>
          </div>
        ) : (
          <div className="home-guest">
            <p className="home-subtitle">
              Start building amazing things with React and Firebase
            </p>
            <div className="home-buttons">
              <Link to="/signup" className="home-btn primary">
                Get Started
              </Link>
              <Link to="/login" className="home-btn secondary">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;