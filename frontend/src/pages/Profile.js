import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        
        <div className="profile-info">
          <div className="info-row">
            <span className="label">Display Name:</span>
            <span className="value">{user.displayName || 'N/A'}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          
          <div className="info-row">
            <span className="label">User ID:</span>
            <span className="value">{user.uid}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Role:</span>
            <span className="value">{user.role || 'user'}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Email Verified:</span>
            <span className="value">{user.emailVerified ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;