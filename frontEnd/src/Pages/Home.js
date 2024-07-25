import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Home.css';
import Layout from './Layout';

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ sortBy: 'newest', genre: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('searchTerm') || '';
    const sortBy = params.get('sortBy') || 'newest';
    const genre = params.get('genre') || '';
    setSearchQuery(searchTerm);
    setFilter({ sortBy, genre });
  }, [location.search]);

  useEffect(() => {
    fetchPosts();
  }, [filter, searchQuery]);

  const fetchPosts = () => {
    axios.get('http://localhost:8081/posts', { params: { ...filter, searchTerm: searchQuery } }) // Changed query to searchTerm
      .then(res => {
        const postsWithUsernames = res.data.map(post => ({
          ...post,
          user_name: post.user_name || 'Unknown', // Default value
        }));
        setPosts(postsWithUsernames);
      })
      .catch(err => {
        console.log("Error fetching posts:", err);
      });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilter({ ...filter, query });
    navigate(`/home?searchTerm=${query}`);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <Layout onSearch={handleSearch} onFilterChange={handleFilterChange}>
      <div className="home-container">
        <div className="posts-list">
          {posts.length ? posts.map(post => (
            <div key={post.id} className="post-card" onClick={() => handleCardClick(post.id)}>
              <div className="post-price-container">
                <p className="post-price">€{parseFloat(post.price).toFixed(2)}</p>
              </div>
              <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image" />
              <div className="post-details">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-author">Author: {post.author}</p>
                <p className="post-genre">Genre: {post.genre}</p>
                <p className="post-user">Posted by: {post.user_name}</p>
              </div>
            </div>
          )) : <p>No posts found</p>}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
