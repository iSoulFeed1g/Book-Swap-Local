import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profilePicPath, setProfilePicPath] = useState('');
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

    const handleSearch = (query) => {
        if (query.trim() === '') {
            fetchPosts(user.email); // Fetch all posts again if the search query is empty
        } else {
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) || 
                post.description.toLowerCase().includes(query.toLowerCase())
            );
            setPosts(filteredPosts);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Layout onSearch={handleSearch}>
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
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handlePostClick(post.id)}
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
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
