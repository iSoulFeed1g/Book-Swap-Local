import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Validation from './SignupValidation';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        const errors = Validation({ name, email, password, confirmPassword });
        setErrorMessage(errors);

        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:8081/signup', { name, email, password })
                .then(res => {
                    if (res.data === "Error") {
                        setErrorMessage({ general: 'Signup failed' });
                    } else {
                        localStorage.setItem('user', JSON.stringify(res.data));
                        localStorage.setItem('userId', res.data.id); // Store userId in localStorage
                        navigate('/onboarding');
                    }
                })
                .catch(err => {
                    setErrorMessage({ general: 'Signup failed' });
                    console.error(err);
                });
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Determine password strength
        if (value.length < 6) {
            setPasswordStrength('Weak');
        } else if (value.length < 10) {
            setPasswordStrength('Moderate');
        } else {
            setPasswordStrength('Strong');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-title">
                📚 <span>Book-Swap</span>
            </div>
            <div className="signup-box">
                <h2>Sign up</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            required
                        />
                        {errorMessage.name && <span className="text-danger">{errorMessage.name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            required
                        />
                        {errorMessage.email && <span className="text-danger">{errorMessage.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="form-control"
                            required
                        />
                        <span className={`password-strength ${passwordStrength.toLowerCase()}`}>
                            {passwordStrength}
                        </span>
                        {errorMessage.password && <span className="text-danger">{errorMessage.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                        {errorMessage.confirmPassword && <span className="text-danger">{errorMessage.confirmPassword}</span>}
                    </div>
                    {errorMessage.general && <span className="text-danger">{errorMessage.general}</span>}
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
                <p>Already have an account? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
}

export default Signup;
