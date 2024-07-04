import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

function Home() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios.get('http://localhost:8081/all-posts')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                }
            })
            .catch(err => {
                setPosts([]);
            });
    };

    const handleSearch = (query) => {
        if (query.trim() === '') {
            fetchPosts();
        } else {
            axios.get('http://localhost:8081/search-posts', {
                params: { q: query }
            })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                }
            })
            .catch(err => {
                setPosts([]);
            });
        }
    };

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    return (
        <Layout onSearch={handleSearch}>
            <div className="home-container">
                <h2>All Posts</h2>
                <div className="posts-container">
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map(post => (
                            <div className="post" key={post.id} onClick={() => handlePostClick(post.id)}>
                                <img src={`http://localhost:8081/${post.picture || 'uploads/1719331628307.png'}`} alt={post.title} className="post-image" />
                                <div className="post-details">
                                    <p className="post-title">{post.title}</p>
                                    <p className="post-description">{post.description}</p>
                                    {post.price !== undefined && post.price !== null ? (
                                        <p className="post-price">Price: €{parseFloat(post.price).toFixed(2)}</p>
                                    ) : (
                                        <p className="post-price">Price: N/A</p>
                                    )}
                                    <p className="post-user">Posted by: {post.user_name || 'Unknown'}</p>
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
            </div>
        </Layout>
    );
}

export default Home;
