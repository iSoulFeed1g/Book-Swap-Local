import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import './PostDetail.css';
import OwnPostDetail from './OwnPostDetail';
import Layout from './Layout';
import ChatModal from './ChatModal';

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchPost();
    }, []);

    const fetchPost = () => {
        axios.get(`http://localhost:8081/post/${id}`)
            .then(res => {
                console.log('Fetched post data:', res.data);
                setPost(res.data);
            })
            .catch(err => {
                console.log("Error fetching post:", err);
            });
    };

    const handleContactSeller = () => {
        setShowChatModal(true);
    };

    const handleSearch = (query) => {
        console.log('Search query:', query);
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    if (user && post.user_email === user.email) {
        return <OwnPostDetail post={post} navigate={navigate} />;
    }

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
                        <div className="purchase-actions">
                            <button className="btn btn-primary">Buy Now</button>
                            <button className="btn btn-secondary">Add to Cart</button>
                            <button className="btn btn-secondary">Add to Wishlist</button>
                            <button className="btn btn-secondary" onClick={handleContactSeller}>Contact Seller</button>
                        </div>
                        <p className="post-user">Posted by: {post.user_name || 'Unknown'}</p>
                    </div>
                </div>
                {showChatModal && (
                    <ChatModal
                        post={post}
                        user={user}
                        onClose={() => setShowChatModal(false)}
                    />
                )}
            </div>
        </Layout>
    );
}

export default PostDetail;
