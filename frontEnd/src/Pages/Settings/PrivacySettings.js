import React, { useState } from 'react';
import './PrivacySettings.css';

function PrivacySettings() {
    const [isProfilePublic, setIsProfilePublic] = useState(true);
    const [canSendMessages, setCanSendMessages] = useState(true);

    const handleProfileVisibilityChange = () => {
        setIsProfilePublic(!isProfilePublic);
    };

    const handleMessagesChange = () => {
        setCanSendMessages(!canSendMessages);
    };

    const handleSaveChanges = () => {
        // Logic to save changes
        console.log('Privacy settings saved:', { isProfilePublic, canSendMessages });
    };

    return (
        <div className="privacy-settings">
            <h2>Privacy Settings</h2>
            <div className="privacy-setting">
                <label>
                    <input
                        type="checkbox"
                        checked={isProfilePublic}
                        onChange={handleProfileVisibilityChange}
                    />
                    Make my profile public
                </label>
            </div>
            <div className="privacy-setting">
                <label>
                    <input
                        type="checkbox"
                        checked={canSendMessages}
                        onChange={handleMessagesChange}
                    />
                    Allow anyone to send me messages
                </label>
            </div>
            <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
    );
}

export default PrivacySettings;
