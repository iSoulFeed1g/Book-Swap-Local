import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import './PostDetail.css';
import OwnPostDetail from './OwnPostDetail'; // Ensure this import is correct

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);

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
                setPost(res.data);
            })
            .catch(err => {
                console.log("Error fetching post:", err);
            });
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    if (user && post.user_email === user.email) {
        return <OwnPostDetail post={post} navigate={navigate} />;
    }

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
                    <div className="purchase-actions">
                        <button className="btn btn-primary">Buy Now</button>
                        <button className="btn btn-secondary">Add to Cart</button>
                        <button className="btn btn-secondary">Add to Wishlist</button>
                    </div>
                    <p className="post-user">Posted by: {post.user_name || 'Unknown'}</p>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
