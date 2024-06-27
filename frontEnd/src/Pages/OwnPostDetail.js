import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit, faTrash, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './PostDetail.css';
import { useNavigate } from 'react-router-dom';

function OwnPostDetail({ post }) {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEditPost = (id) => {
        navigate(`/edit-post/${id}`);
    };

    const handleDeletePost = () => {
        setShowDeleteModal(true);
    };

    const confirmDeletePost = () => {
        axios.post('http://localhost:8081/delete-post', { id: post.id })
            .then(res => {
                if (res.data.message === "Success") {
                    navigate('/home');
                } else {
                    alert("Failed to delete post");
                }
            })
            .catch(err => {
                console.error("Error deleting post:", err);
                alert("Error deleting post");
            });
    };

    const cancelDeletePost = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="post-detail-container">
            <div className="navigation-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/home')}>
                    <FontAwesomeIcon icon={faHome} /> Home
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                    <FontAwesomeIcon icon={faUser} /> Profile
                </button>
            </div>
            <div className="post-header">
            </div>
            <div className="post-content">
                <div className="post-image-section">
                    <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image-large" />
                </div>
                <div className="post-info-section">
                    <h1 className="post-title">{post.title}</h1>
                    <p className="post-author">by {post.author} (Author)</p>
                    <p className="post-price">Price: €{parseFloat(post.price).toFixed(2)}</p>
                    <p className="post-description">{post.description}</p>
                    <div className="post-actions">
                        <span className="likes"><FontAwesomeIcon icon={faThumbsUp} /> 10</span>
                        <span className="dislikes"><FontAwesomeIcon icon={faThumbsDown} /> 2</span>
                    </div>
                    <div className="post-management-actions">
                        <button className="btn btn-primary" key={post.id} onClick={() => handleEditPost(post.id)}><FontAwesomeIcon icon={faEdit} /> Edit Post</button>
                        <button className="btn btn-danger" onClick={handleDeletePost}><FontAwesomeIcon icon={faTrash} /> Delete Post</button>
                    </div>
                    <p className="post-user">Posted by: {post.user_name || 'Unknown'}</p>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Are you sure you want to delete this post?</h2>
                        <div className="modal-actions">
                            <button className="btn btn-danger" onClick={confirmDeletePost}>Delete</button>
                            <button className="btn btn-secondary" onClick={cancelDeletePost}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnPostDetail;
