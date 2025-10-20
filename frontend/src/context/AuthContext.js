import { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          
          const response = await authService.login(token);
          if (response.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error.message);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register({
        email,
        password,
        displayName: displayName || email.split('@')[0]
      });

      if (response.success) {
        await signInWithEmailAndPassword(auth, email, password);
        return response;
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      
      const response = await authService.login(token);
      
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
      
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      throw error;
    }
  };

  const getUserProfile = async () => {
    try {
      setError(null);
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Get profile error:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updateData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(updateData);
      if (response.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    updateUserProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;