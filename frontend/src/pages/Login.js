import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from '../components/Form';
import Button from '../components/Button';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await signIn(formData.email, formData.password);
      
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        
        <Form.Error>{error || authError}</Form.Error>

        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group>
            <Form.Label htmlFor="email" required>Email</Form.Label>
            <Form.Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isSubmitting || loading}
              required
              autoComplete="email"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="password" required>Password</Form.Label>
            <Form.Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isSubmitting || loading}
              required
              autoComplete="current-password"
            />
          </Form.Group>

          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting || loading}
            fullWidth
          >
            {isSubmitting || loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;