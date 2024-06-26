import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        axios.post('http://localhost:8081/signup', { name, email, password })
            .then(res => {
                if (res.data === "Error") {
                    setErrorMessage('Signup failed');
                } else {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    navigate('/home');
                }
            })
            .catch(err => {
                setErrorMessage('Signup failed');
                console.error(err);
            });
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Create Account</h2>
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
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            required
                        />
                        <label className="form-check-label" htmlFor="terms">I agree to terms and conditions</label>
                    </div>
                    {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
                <p>Already have an account? <a href="/">Log In</a></p>
            </div>
        </div>
    );
}

export default Signup;
