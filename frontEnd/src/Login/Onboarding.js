import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function Onboarding() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home page after 5 seconds
        const timer = setTimeout(() => {
            navigate('/home');
        }, 4000);

        // Clean up the timer
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="onboarding-container">
            <div className="onboarding-message">
                <h1>🎉 Account Creation Successful!</h1>
                <p>Thank you for creating an account. We are setting up your dashboard.</p>
                <p>You will be redirected shortly...</p>
            </div>
        </div>
    );
}

export default Onboarding;
