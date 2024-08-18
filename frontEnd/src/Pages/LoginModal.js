import React from 'react';
import './LoginModal.css';

const LoginModal = ({ onClose, onLogin }) => {
    // Function to handle click on overlay background
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();  // Close modal if the overlay is clicked
        }
    };

    return (
        <div className="login-modal-overlay" onClick={handleOverlayClick}>
            <div className="login-modal-content">
                <h2>Please log in to access this feature.</h2>
                <button className="btn btn-primary" onClick={onLogin}>
                    Login / Sign Up
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
