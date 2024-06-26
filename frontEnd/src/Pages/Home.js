import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faBars } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

function Home() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios.get('http://localhost:8081/all-posts')
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => {
                console.log("Error fetching all posts:", err);
            });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Implement search functionality here
    };

    return (
        <div className="home-container">
            <header className="header">
                <img src="http://localhost:8081/uploads/logo.png" alt="Logo" className="logo" />
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                        className="search-input" 
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                <div className="nav-menu">
                    <FontAwesomeIcon icon={faBars} className="nav-icon" />
                    <div className="nav-dropdown">
                        <button onClick={() => navigate('/profile')}>Profile</button>
                        <button onClick={() => navigate('/settings')}>Settings</button>
                    </div>
                </div>
            </header>
            <h2>All Posts</h2>
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div className="post" key={post.id}>
                            <img src={`http://localhost:8081/${post.picture || 'uploads/1719331628307.png'}`} alt={post.title} className="post-image" />
                            <div className="post-details">
                                <p className="post-title">{post.title}</p>
                                <p className="post-description">{post.description}</p>
                                <p className="post-user">Posted by: {post.user_name}</p>
                            </div>
                            <div className="post-actions">
                                <span className="likes"><FontAwesomeIcon icon={faThumbsUp} /> 10</span>
                                <span className="dislikes"><FontAwesomeIcon icon={faThumbsDown} /> 2</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-posts">No posts available.</p>
                )}
            </div>
            <footer className="footer">
                <p>&copy; 2024 Book-Swap. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
