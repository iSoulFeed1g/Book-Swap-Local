import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import EditProfile from './EditProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';

function Settings() {
    const [activeTab, setActiveTab] = useState('edit-profile');
    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeTab) {
            case 'edit-profile':
                return <EditProfile />;
            // Add more cases for other settings tabs
            default:
                return <EditProfile />;
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-sidebar">
                <div>
                    <h2>Settings</h2>
                    <ul className="settings-list">
                        <li
                            className={activeTab === 'edit-profile' ? 'active' : ''}
                            onClick={() => setActiveTab('edit-profile')}
                        >
                            <FontAwesomeIcon icon={faUser} className="fa-home" />
                            <span>Edit Profile</span>
                        </li>
                        {/* Add more list items for other settings */}
                    </ul>
                </div>
                <div className="bottom-buttons">
                    <button className="btn-user" onClick={() => navigate('/profile')}>
                        <FontAwesomeIcon icon={faUser} className="fa-home" />
                        Profile
                    </button>
                    <button className="btn-home" onClick={() => navigate('/home')}>
                        <FontAwesomeIcon icon={faHome} className="fa-home" />
                        Home
                    </button>
                </div>
            </div>
            <div className="settings-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default Settings;
