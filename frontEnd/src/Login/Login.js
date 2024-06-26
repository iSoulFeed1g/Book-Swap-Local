import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage('');

        axios.post('http://localhost:8081/login', { email, password })
            .then(res => {
                if (res.data === "Failed") {
                    setErrorMessage('Invalid email or password');
                } else {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    navigate('/home');
                }
            })
            .catch(err => {
                setErrorMessage('Login failed');
                console.error(err);
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log in</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="btn btn-primary">Log in</button>
                </form>
                <p>Don't have an account? <a href="/signup">Create Account</a></p>
            </div>
        </div>
    );
}

export default Login;
