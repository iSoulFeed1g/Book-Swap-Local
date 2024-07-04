import React, { useState } from 'react';
import './AccountSettings.css';

function AccountSettings() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSaveChanges = () => {
        // Logic to save changes
        console.log('Account settings saved:', { username, email, currentPassword, newPassword });
    };

    const handleDeleteAccount = () => {
        // Logic to delete account
        console.log('Account deleted');
    };

    return (
        <div className="account-settings">
            <h2>Account Settings</h2>
            <div className="account-setting">
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </label>
            </div>
            <div className="account-setting">
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </label>
            </div>
            <div className="account-setting">
                <label>
                    Current Password:
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                    />
                </label>
            </div>
            <div className="account-setting">
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                    />
                </label>
            </div>
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={handleDeleteAccount} className="delete-account-button">Delete Account</button>
        </div>
    );
}

export default AccountSettings;
