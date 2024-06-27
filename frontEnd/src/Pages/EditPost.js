import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';

function EditPost() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');  // Add author state
    const [price, setPrice] = useState('');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [authorError, setAuthorError] = useState(false);  // Add author error state
    const [priceError, setPriceError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/post/${id}`);
            console.log("Fetched post data:", res.data);
            const post = res.data;
            setTitle(post.title);
            setDescription(post.description);
            setAuthor(post.author);  // Set author state
            setPrice(post.price);
            setSelectedImage(post.picture);
        } catch (err) {
            console.log("Error fetching post:", err);
        }
    };

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleUpdatePost = () => {
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

        if (!author) {
            setAuthorError(true);
            hasError = true;
        } else {
            setAuthorError(false);
        }

        if (!price) {
            setPriceError(true);
            hasError = true;
        } else {
            setPriceError(false);
        }

        if (hasError) {
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', author);  // Append author to formData
        formData.append('price', price);

        axios.post(`http://localhost:8081/update-post/${id}`, formData)
            .then(res => {
                if (res.data.message === "Success") {
                    navigate('/profile');
                } else {
                    console.log("Failed to update post");
                }
            })
            .catch(err => {
                console.log("Error occurred while updating post", err);
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
            <h2>Edit Post</h2>
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
                                src={typeof selectedImage === 'string' ? `http://localhost:8081/${selectedImage}` : URL.createObjectURL(selectedImage)}
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
            <button className="btn btn-primary mt-2" onClick={handleUpdatePost}>Save Changes</button>
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

export default EditPost;
