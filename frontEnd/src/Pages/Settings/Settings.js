import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import PrivacySettings from './PrivacySettings';
import AccountSettings from './AccountSettings';
import Layout from '../Layout';
import './Settings.css';

function Settings() {
    const [activeTab, setActiveTab] = useState('edit-profile');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData);
        } else {
            setUser(null); // Ensure user is null if not logged in
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'edit-profile':
                return <EditProfile />;
            case 'privacy-settings':
                return <PrivacySettings />;
            case 'account-settings':
                return <AccountSettings />;
            default:
                return <EditProfile />;
        }
    };

    const handleSearch = (query) => {
        // Implement search functionality if needed for Settings
        console.log('Search query:', query);
    };
    
    if (!user) {
        return (
            <Layout>
                <div className="please-login">
                    <div className="login-message">
                        <p>Please log in to access your Settings.</p>
                        <button className="btn btn-primary login-button" onClick={() => navigate('/login')}>
                            Login / Sign Up
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout onSearch={handleSearch}>
            <div className="settings-page">
                <div className="settings-sidebar">
                    <h1>Settings</h1>
                    <ul className="settings-list">
                        <li
                            className={activeTab === 'edit-profile' ? 'active' : ''}
                            onClick={() => setActiveTab('edit-profile')}
                        >
                            Edit Profile
                        </li>
                        <li
                            className={activeTab === 'privacy-settings' ? 'active' : ''}
                            onClick={() => setActiveTab('privacy-settings')}
                        >
                            Privacy Settings
                        </li>
                        <li
                            className={activeTab === 'account-settings' ? 'active' : ''}
                            onClick={() => setActiveTab('account-settings')}
                        >
                            Account Settings
                        </li>
                    </ul>
                </div>
                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </Layout>
    );
}

export default Settings;
