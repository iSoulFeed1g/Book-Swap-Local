import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './PostDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';

function OwnPostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/post/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error('Error fetching post:', err);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) {
        return <div>Loading post details...</div>;
    }

    const handleEditPost = (id) => {
        navigate(`/edit-post/${id}`);
    };

    const handleDeletePost = () => {
        setShowDeleteModal(true);
    };

    const confirmDeletePost = async () => {
        try {
            const response = await axios.post('http://localhost:8081/delete-post', { id: post.id });
            if (response.data.message === "Success") {
                navigate('/home');
            } else {
                alert("Failed to delete post");
            }
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Error deleting post");
        }
    };

    const cancelDeletePost = () => {
        setShowDeleteModal(false);
    };

    const handleSearch = (query) => {
        console.log('Search query:', query);
    };

    return (
        <Layout onSearch={handleSearch}>
            <div className="post-detail-container">
                <div className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    <p className="post-price">Price: €{parseFloat(post.price).toFixed(2)}</p>
                </div>
                <div className="post-content">
                    <div className="post-image-section">
                        <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image-large" />
                    </div>
                    <div className="post-info-section">
                        <div className="post-user-info">
                            {post.user_profile_pic && (
                                <img src={`http://localhost:8081/${post.user_profile_pic}`} alt={post.user_name} className="user-profile-pic" />
                            )}
                            <div className="user-info-text">
                                <p className="post-user-name">{post.user_name}</p>
                                <div className="post-user-likes">
                                    <span className="likes"><FontAwesomeIcon icon={faThumbsUp} /> {post.user_likes}</span>
                                    <span className="dislikes"><FontAwesomeIcon icon={faThumbsDown} /> {post.user_dislikes}</span>
                                </div>
                            </div>
                        </div>
                        <p className="post-description">{post.description}</p>
                        <div className="post-actions">
                            <span className="likes"><FontAwesomeIcon icon={faThumbsUp} /> 10</span>
                            <span className="dislikes"><FontAwesomeIcon icon={faThumbsDown} /> 2</span>
                        </div>
                        <div className="post-management-actions">
                            <button className="btn btn-primary" onClick={() => handleEditPost(post.id)}><FontAwesomeIcon icon={faEdit} /> Edit Post</button>
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
        </Layout>
    );
}

export default OwnPostDetail;
