import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import the CSS file
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const user = await login(formData.username, formData.password);
      
      // Redirect based on role
      if (user.role === 'lecturer') {
        navigate('/teacher');
      } else if (user.role === 'student') {
        navigate('/student');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="banner"></div>
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-header">Welcome to Learning Management System</h2>
          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="login-form-elements">
            <div className="form-group">
              <label htmlFor="username" className="label-text">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="label-text">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="forgot-password">
            <a href="#" className="forgot-password-link">Forgot Password?</a>
          </p>
          <p className="create-account">
            Don't have an account? <Link to="/signup" className="create-account-link">Create Account</Link>
          </p>
        </div>
      </div >
    </div>
  );
};

export default LoginPage;
