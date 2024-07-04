import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faPaperPlane, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Layout = ({ children, onSearch }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className={`sidebar-icon ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
                    <FontAwesomeIcon icon={faHome} />
                </div>
                <div className={`sidebar-icon ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile')}>
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={`sidebar-icon ${isActive('/inbox') ? 'active' : ''}`} onClick={() => navigate('/inbox')}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </div>
                <div className={`sidebar-icon ${isActive('/settings') ? 'active' : ''}`} onClick={() => navigate('/settings')}>
                    <FontAwesomeIcon icon={faCog} />
                </div>
            </aside>
            <div className="main-content">
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
                        <button type="submit" className="search-button">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                    <button className="add-post-button" onClick={() => navigate('/create-post')}>
                        <FontAwesomeIcon icon={faPlus} /> Add Post
                    </button>
                </header>
                {children}
            </div>
        </div>
    );
};

export default Layout;
