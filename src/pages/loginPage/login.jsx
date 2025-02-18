import React, { useState } from 'react';
import './login.css'; // Import the CSS file

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-header">Welcome to Third Space Global</h2>
        <form onSubmit={handleSubmit} className="login-form-elements">
          <div className="form-group">
            <label htmlFor="email" className="label-text">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
          >
            Login
          </button>
        </form>
        <p className="forgot-password">
          <a href="#" className="forgot-password-link">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
