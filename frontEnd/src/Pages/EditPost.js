import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';
import Layout from './Layout'; // Import the Layout component

function EditPost() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [genre, setGenre] = useState(''); // New state for genre
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [authorError, setAuthorError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [genreError, setGenreError] = useState(false); // New error state for genre
    const [genres, setGenres] = useState([]); // State for genres
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
        fetchGenres(); // Fetch genres from the database
    }, []);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/post/${id}`);
            console.log("Fetched post data:", res.data);
            const post = res.data;
            setTitle(post.title);
            setDescription(post.description);
            setAuthor(post.author);
            setPrice(post.price);
            setGenre(post.genre); // Set genre state
            setSelectedImage(post.picture);
        } catch (err) {
            console.log("Error fetching post:", err);
        }
    };

    const fetchGenres = async () => {
        try {
            const res = await axios.get('http://localhost:8081/genres');
            setGenres(res.data);
        } catch (err) {
            console.error("Error fetching genres:", err);
        }
    };

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const triggerShakeAnimation = () => {
        const elements = document.querySelectorAll('.error-border');
        elements.forEach(el => {
            el.classList.remove('shake');
            setTimeout(() => el.classList.add('shake'), 0);
        });
    };

    const handleUpdatePost = () => {
        let hasError = false;

        const titleElement = document.querySelector('#title');
        const descriptionElement = document.querySelector('#description');
        const priceElement = document.querySelector('#price');
        const authorElement = document.querySelector('#author');
        const genreElement = document.querySelector('#genre');

        if (!title) {
            setTitleError(true);
            triggerShakeAnimation(titleElement);
            hasError = true;
        } else {
            setTitleError(false);
        }

        if (!description) {
            setDescriptionError(true);
            triggerShakeAnimation(descriptionElement);
            hasError = true;
        } else {
            setDescriptionError(false);
        }

        if (!author) {
            setAuthorError(true);
            triggerShakeAnimation(authorElement);
            hasError = true;
        } else {
            setAuthorError(false);
        }

        if (!price) {
            setPriceError(true);
            triggerShakeAnimation(priceElement);
            hasError = true;
        } else {
            setPriceError(false);
        }

        if (!genre) {
            setGenreError(true);
            triggerShakeAnimation(genreElement);
            hasError = true;
        } else {
            setGenreError(false);
        }

        if (hasError) {
            return;
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', author);
        formData.append('price', price);
        formData.append('genre', genre); // Append genre to formData
        if (selectedImage) {
            formData.append('picture', selectedImage);
        }

        axios.post('http://localhost:8081/edit-post', formData)
            .then(res => {
                if (res.data.message === "Success") {
                    navigate(`/post/${id}`);
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

    const handleSearch = (query) => {
        console.log('Search query:', query);
    };

    return (
        <Layout onSearch={handleSearch}>
            <div className="create-post-container">
                <h2>Edit Post</h2>
                <input
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`form-control mt-2 ${titleError ? 'error-border' : ''}`}
                />
                <textarea
                    id="description"
                    placeholder="Write a caption..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`form-control mt-2 ${descriptionError ? 'error-border' : ''}`}
                ></textarea>
                <input
                    id="author"
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`form-control mt-2 ${authorError ? 'error-border' : ''}`}
                />
                <div className="price-input-container">
                    <input
                        id="price"
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`form-control mt-2 price-input ${priceError ? 'error-border' : ''}`}
                    />
                    <span className="currency-symbol">€</span>
                </div>
                <div className="genre-input-container">
                    <select
                        id="genre"
                        className={`form-control mt-2 ${genreError ? 'error-border' : ''}`}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="">Select Genre</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.name}>{genre.name}</option>
                        ))}
                    </select>
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
        </Layout>
    );
}

export default EditPost;
