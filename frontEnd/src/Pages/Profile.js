import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faThumbsDown, faPowerOff, faCog, faHome, faEdit, faTrash, faSearch  } from '@fortawesome/free-solid-svg-icons';
import CreatePost from './CreatePost';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPath, setProfilePicPath] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null); // State for editing post
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData);
            setProfilePicPath(parsedData.profile_pic || '');
            fetchPosts(parsedData.email);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchPosts = (email) => {
        axios.get(`http://localhost:8081/posts?email=${email}`)
            .then(res => {
                const sortedPosts = res.data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
            })
            .catch(err => {
                console.log(err);
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
                    console.log("Failed to upload profile picture");
                }
            })
            .catch(err => {
                console.log("Error occurred while uploading profile picture", err);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleCreatePost = () => {
        navigate('/create-post', { state: { user } });
    };

    const handleCancelPost = () => {
        setShowDiscardModal(true);
    };

    const handleDiscardPost = () => {
        setShowModal(false);
        setShowDiscardModal(false);
    };

    const handleEditPost = (post) => {
        setEditingPostId(post.id);
        setTitle(post.title);
        setDescription(post.description);
        setPrice(post.price);
        setShowModal(true);
    };

    const handleDeletePost = () => {
        axios.post('http://localhost:8081/delete-post', {
            id: editingPostId
        })
            .then(res => {
                if (res.data.message === "Success") {
                    fetchPosts(user.email);
                    setShowDeleteModal(false);
                } else {
                    console.log("Failed to delete post");
                }
            })
            .catch(err => {
                console.log("Error occurred while deleting post", err);
            });
    };

    const handleDeleteClick = (postId) => {
        setEditingPostId(postId);
        setShowDeleteModal(true);
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            <div className="header">
                <div className="logo"> 
                    <img src="/logo.png" alt="Logo" />
                </div>
                <form className="search-form">
                    <input type="text" placeholder="Search..." className="search-input" />
                    <button type="submit" className="search-button">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>
                <div className="nav-menu">
                    <FontAwesomeIcon icon={faUser} className="nav-icon" />
                    <div className="nav-dropdown">
                        <button onClick={() => navigate('/profile')}>Profile</button>
                        <button onClick={() => navigate('/settings')}>Settings</button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
            <div className="profile-container">
                <div className="profile-info-container">
                    <div className="profile-picture">
                        {profilePicPath && <img src={`http://localhost:8081/${profilePicPath}`} alt="Profile" className="profile-pic-large" />}
                        <div className="user-info mt-3">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            <div className="ratings">
                                <span className="likes"><FontAwesomeIcon icon={faThumbsUp} /> 10</span>
                                <span className="dislikes"><FontAwesomeIcon icon={faThumbsDown} /> 2</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <button className="btn btn-danger mt-3" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faPowerOff} /> Log Out
                        </button>
                    </div>
                </div>
                <div className="posts-section">
                    <h2>Your Posts</h2>
                    <div className="posts-container">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <div
                                    className="post"
                                    key={post.id}
                                    onClick={() => handlePostClick(post.id)} // Add onClick handler
                                    style={{ cursor: 'pointer' }} // Add cursor pointer style
                                >
                                    <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image" />
                                    <div className="post-details">
                                        <p className="post-title">{post.title}</p>
                                        <p className="post-description">{post.description}</p>
                                        <p className="post-price">Price: €{parseFloat(post.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-posts">You haven't published a post yet.</p>
                        )}
                    </div>
                    <button className="btn btn-success mt-3" onClick={handleCreatePost}>Create Post</button>
                </div>
                {showDiscardModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>Discard post?</p>
                            <p>If you leave, your edits won't be saved.</p>
                            <button className="btn btn-danger mt-2" onClick={handleDiscardPost}>Discard</button>
                            <button className="btn btn-secondary mt-2" onClick={() => setShowDiscardModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>Are you sure you want to delete this post?</p>
                            <button className="btn btn-danger mt-2" onClick={handleDeletePost}>Delete</button>
                            <button className="btn btn-secondary mt-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
