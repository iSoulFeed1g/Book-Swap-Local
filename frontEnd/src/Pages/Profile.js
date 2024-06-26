import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faThumbsDown, faPowerOff, faCog, faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
            navigate('/');
        }
    }, [navigate]);

    const fetchPosts = (email) => {
        axios.get(`http://localhost:8081/posts?email=${email}`)
            .then(res => {
                setPosts(res.data);
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
        setSelectedImage(null);  // Reset the selected image when opening the modal
        setShowModal(true);
        setEditingPostId(null);  // Reset editing post ID when creating a new post
        setTitle('');  // Reset title
        setDescription('');  // Reset description
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSharePost = () => {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('email', user.email);

        axios.post('http://localhost:8081/create-post', formData)
            .then(res => {
                if (res.data.message === "Success") {
                    fetchPosts(user.email);
                    setShowModal(false);
                } else {
                    console.log("Failed to create post");
                }
            })
            .catch(err => {
                console.log("Error occurred while creating post", err);
            });
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
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        axios.post('http://localhost:8081/update-post', {
            id: editingPostId,
            title,
            description
        })
            .then(res => {
                if (res.data.message === "Success") {
                    fetchPosts(user.email);
                    setShowModal(false);
                } else {
                    console.log("Failed to update post");
                }
            })
            .catch(err => {
                console.log("Error occurred while updating post", err);
            });
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-info-container">
                <div className="profile-picture">
                    {profilePicPath && <img src={`http://localhost:8081/${profilePicPath}`} alt="Profile" className="profile-pic-large" />}
                    <input type="file" onChange={handleFileChange} className="form-control mt-2" />
                    <button className="btn btn-primary mt-2" onClick={handleUploadProfilePic}>Change Profile Picture</button>
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
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/home')}>
                        <FontAwesomeIcon icon={faHome} /> Home
                    </button>
                    <button className="btn btn-secondary mt-3" onClick={() => navigate('/settings')}>
                        <FontAwesomeIcon icon={faCog} /> Settings
                    </button>
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
                            <div className="post" key={post.id}>
                                <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image" />
                                <div className="post-details">
                                    <p className="post-title">{post.title}</p>
                                    <p className="post-description">{post.description}</p>
                                </div>
                                <div className="post-actions">
                                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditPost(post)} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteClick(post.id)} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-posts">You haven't published a post yet.</p>
                    )}
                </div>
                <button className="btn btn-success mt-3" onClick={handleCreatePost}>Create Post</button>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editingPostId ? 'Edit Post' : 'Upload an image'}</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control mt-2"
                        />
                        <textarea
                            placeholder="Write a caption..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control mt-2"
                        ></textarea>
                        {!selectedImage && !editingPostId && (
                            <input type="file" onChange={handleImageChange} />
                        )}
                        {editingPostId ? (
                            <button className="btn btn-primary mt-2" onClick={handleSaveChanges}>Save Changes</button>
                        ) : (
                            <button className="btn btn-primary mt-2" onClick={handleSharePost}>Share</button>
                        )}
                        <button className="btn btn-secondary mt-2" onClick={handleCancelPost}>Cancel</button>
                    </div>
                </div>
            )}
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
    );
}

export default Profile;
