import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faImage } from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [picture, setPicture] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    };

    const handleSubmit = () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const { email } = JSON.parse(userData);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('picture', picture);
        formData.append('email', email);

        axios.post('http://localhost:8081/create-post', formData)
            .then(res => {
                if (res.data === "Success") {
                    navigate('/profile');
                } else {
                    console.log("Failed to create post");
                }
            })
            .catch(err => {
                console.log("Error occurred while creating post", err);
            });
    };

    return (
        <div className="create-post-container">
            <h2>Create New Post</h2>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="form-control"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="picture">Upload Picture</label>
                <input type="file" id="picture" onChange={handleFileChange} className="form-control-file" />
            </div>
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                <FontAwesomeIcon icon={faArrowRight} /> Share
            </button>
        </div>
    );
}

export default CreatePost;
