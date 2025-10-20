import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from '../components/Form';
import Button from '../components/Button';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await signUp(
        formData.email, 
        formData.password,
        formData.displayName || formData.email.split('@')[0]
      );
      
      // Redirect to home or dashboard
      navigate('/');
      
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        
        <Form.Error>{error || authError}</Form.Error>

        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group>
            <Form.Label htmlFor="displayName">Display Name (Optional)</Form.Label>
            <Form.Input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter your display name"
              disabled={isSubmitting || loading}
              autoComplete="name"
            />
          </Form.Group>

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
              placeholder="Enter your password (min 6 characters)"
              disabled={isSubmitting || loading}
              required
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="confirmPassword" required>Confirm Password</Form.Label>
            <Form.Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={isSubmitting || loading}
              required
              autoComplete="new-password"
            />
          </Form.Group>

          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting || loading}
            fullWidth
          >
            {isSubmitting || loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;