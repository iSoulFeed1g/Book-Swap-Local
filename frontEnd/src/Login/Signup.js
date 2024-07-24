import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setErrorMessage('');

        axios.post('http://localhost:8081/signup', { name, email, password })
            .then(res => {
                if (res.data === "Error") {
                    setErrorMessage('Signup failed');
                } else {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    localStorage.setItem('userId', res.data.id); // Store userId in localStorage
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
                <h2>Book-Swap</h2>
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
                    {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
                <p>Already have an account? <a href="/">Log in</a></p>
            </div>
        </div>
    );
}

export default Signup;
