import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './EditProfile.css';

function EditProfile() {
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPath, setProfilePicPath] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData);
            setProfilePicPath(parsedData.profile_pic || '');
        } else {
            navigate('/'); // Redirect to login if user data is not found
        }
    }, [navigate]);

    const handlePasswordChange = () => {
        setErrorMessage("");
        setSuccessMessage("");

        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            setErrorMessage("Password must be at least 8 characters long, contain at least one number, one uppercase and one lowercase letter.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        axios.post('http://localhost:8081/change-password', { email: user.email, newPassword })
            .then(res => {
                if (res.data === "Success") {
                    setSuccessMessage("Password changed successfully");
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    setErrorMessage("Failed to change password");
                }
            })
            .catch(err => {
                setErrorMessage("Failed to change password");
                console.log(err);
            });
    };

    const handleDeleteProfile = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmDelete = () => {
        axios.post('http://localhost:8081/delete-profile', { email: user.email })
            .then(res => {
                if (res.data === "Success") {
                    localStorage.removeItem('user');
                    navigate('/');
                } else {
                    setErrorMessage("Failed to delete profile");
                }
                setShowModal(false);
            })
            .catch(err => {
                setErrorMessage("Error occurred while deleting profile");
                console.log(err);
                setShowModal(false);
            });
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleUploadProfilePic = () => {
        const formData = new FormData();
        formData.append('profilePic', profilePic);
        formData.append('email', user.email);

        axios.post('http://localhost:8081/upload-profile-pic', formData)
            .then(res => {
                if (res.data.message === "Success") {
                    setProfilePicPath(res.data.profilePicPath);
                    const updatedUser = { ...user, profile_pic: res.data.profilePicPath };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                } else {
                    setErrorMessage("Failed to upload profile picture");
                }
            })
            .catch(err => {
                setErrorMessage("Error occurred while uploading profile picture");
                console.log(err);
            });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-card card mt-3">
            <div className="card-body">
                <h3 className="card-title">
                    <FontAwesomeIcon icon={faUser} /> Edit Profile
                </h3>
                <div className="profile-pic-container">
                    {profilePicPath && <img src={`http://localhost:8081/${profilePicPath}`} alt="Profile" className="profile-pic" />}
                    <input type="file" onChange={handleFileChange} className="form-control" />
                    <button className="btn btn-primary mt-2" onClick={handleUploadProfilePic}>Upload Profile Picture</button>
                </div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div className="mb-3">
                    <label><strong>Password:</strong></label>
                    <div className="input-group">
                        <input
                            type="password"
                            className="form-control"
                            value={user.password}
                            readOnly
                        />
                    </div>
                </div>
                <hr />
                <h5>Change Password</h5>
                <div className="mb-3">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    {successMessage && <span className="text-success">{successMessage}</span>}
                </div>
                <button className="btn btn-success" onClick={handlePasswordChange}>
                    Change Password
                </button>
                <hr />
                <button className="btn btn-danger" onClick={handleDeleteProfile}>
                    Delete Profile
                </button>
            </div>
            <ConfirmDeleteModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default EditProfile;
