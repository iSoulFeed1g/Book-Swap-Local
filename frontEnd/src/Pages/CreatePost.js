import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';

function CreatePost({ user, fetchPosts, setShowModal, editingPostId, setEditingPostId, initialTitle, initialDescription, initialPrice }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const [price, setPrice] = useState(initialPrice || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setPicturePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPicturePreview(null);
    };

    const handleSubmit = () => {
        if (!title || !description || !price) {
            setErrorMessage('Title, description, and price are required');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('email', user.email);

        const url = editingPostId ? 'http://localhost:8081/update-post' : 'http://localhost:8081/create-post';
        if (editingPostId) {
            formData.append('id', editingPostId);
        }

        axios.post(url, formData)
            .then(res => {
                if (res.data.message === "Success") {
                    fetchPosts(user.email);
                    setShowModal(false);
                    setEditingPostId(null);
                } else {
                    setErrorMessage('Error creating/updating post');
                }
            })
            .catch(err => {
                setErrorMessage('Error creating/updating post');
                console.error(err);
            });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{editingPostId ? 'Edit Post' : 'Publish a Post'}</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control mt-2"
                />
                <textarea
                    placeholder="Write a caption..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control mt-2"
                ></textarea>
                <input
                    type="number"
                    placeholder="Price (€)"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control mt-2"
                />
                {!editingPostId && (
                    <div className="file-input-container">
                        <label className="file-input-label">
                            Choose File
                            <input
                                type="file"
                                onChange={handleImageChange}
                            />
                        </label>
                        {picturePreview && (
                            <div className="image-preview">
                                <img src={picturePreview} alt="Selected" />
                                <button type="button" className="remove-image-button" onClick={handleRemoveImage}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button className="btn btn-primary mt-2" onClick={handleSubmit}>{editingPostId ? 'Save Changes' : 'Share'}</button>
                <button className="btn btn-secondary mt-2" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    );
}

export default CreatePost;
