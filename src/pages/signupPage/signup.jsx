import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "student", // Default to student
    });
    const [signupError, setSignupError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
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
        if (formData.password !== formData.confirmPassword) {
            setSignupError("Passwords do not match!");
            return;
        }
        
        setLoading(true);
        setSignupError('');
        
        try {
            // Prepare data for backend
            const userData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: formData.role
            };
            
            // Add role-specific profile data
            if (formData.role === 'lecturer') {
                userData.lecturer_profile = {
                    department: "",
                    bio: "",
                    qualification: ""
                };
            } else {
                userData.student_profile = {
                    enrollment_number: "",
                    semester: 1,
                    program: ""
                };
            }
            
            await register(userData);
            navigate('/'); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Registration failed:", error);
            setSignupError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2 className="signup-header">Create Your Account</h2>
                {signupError && (
                    <div className="error-message">
                        {signupError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="signup-form-elements">
                    <div className="form-group">
                        <label htmlFor="first_name" className="label-text">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name" className="label-text">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            className="input-field"
                        />
                    </div>
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
                        <label htmlFor="username" className="label-text">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role" className="label-text">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="label-text">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            required
                            className="input-field"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <p className="already-account">
                    Already have an account? <Link to="/" className="login-link">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
