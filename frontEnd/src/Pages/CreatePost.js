import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';

function CreatePost() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [authorError, setAuthorError] = useState(false);
    const [user, setUser] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSharePost = () => {
        let hasError = false;

        if (!title) {
            setTitleError(true);
            hasError = true;
        } else {
            setTitleError(false);
        }

        if (!description) {
            setDescriptionError(true);
            hasError = true;
        } else {
            setDescriptionError(false);
        }

        if (!price) {
            setPriceError(true);
            hasError = true;
        } else {
            setPriceError(false);
        }

        if (!author) {
            setAuthorError(true);
            hasError = true;
        } else {
            setAuthorError(false);
        }

        if (hasError) {
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('author', author);
        formData.append('email', user.email);

        axios.post('http://localhost:8081/create-post', formData)
            .then(res => {
                if (res.data.message === "Success") {
                    navigate('/profile');
                } else {
                    console.log("Failed to create post");
                }
            })
            .catch(err => {
                console.log("Error occurred while creating post", err);
            });
    };

    const handleCancelPost = () => {
        setShowDiscardModal(true);
    };

    const handleDiscardPost = () => {
        setShowDiscardModal(false);
        navigate('/profile');
    };

    return (
        <div className="create-post-container">
            <h2>Publish a Post</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`form-control mt-2 ${titleError ? 'error-border' : ''}`}
            />
            <textarea
                placeholder="Write a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`form-control mt-2 ${descriptionError ? 'error-border' : ''}`}
            ></textarea>
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`form-control mt-2 ${authorError ? 'error-border' : ''}`}
            />
            <div className="price-input-container">
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`form-control mt-2 price-input ${priceError ? 'error-border' : ''}`}
                />
                <span className="currency-symbol">€</span>
            </div>
            <div className="image-upload-section">
                <label htmlFor="file-input" className="image-upload-label">
                    Add or Drag & Drop an image
                </label>
                <input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    className="form-control mt-2"
                    style={{ display: 'none' }}
                />
                <div
                    className="drop-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        setSelectedImage(e.dataTransfer.files[0]);
                    }}
                >
                    {selectedImage ? (
                        <div className="image-preview">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Selected"
                                className="selected-image"
                            />
                            <button
                                className="remove-image-button"
                                onClick={() => setSelectedImage(null)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ) : (
                        <p>Add or Drag & Drop an image</p>
                    )}
                </div>
            </div>
            <button className="btn btn-primary mt-2" onClick={handleSharePost}>Share</button>
            <button className="btn btn-secondary mt-2" onClick={handleCancelPost}>Cancel</button>

            {showDiscardModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Discard post?</p>
                        <p>If you leave, your edits won't be saved.</p>
                        <button className="btn btn-danger mt-2" onClick={handleDiscardPost}>Discard</button>
                        <button className="btn btn-secondary mt-2" onClick={() => setShowDiscardModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreatePost;
