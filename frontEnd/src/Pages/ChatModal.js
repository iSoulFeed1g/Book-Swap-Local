import React, { useState } from 'react';
import axios from 'axios';
import './ChatModal.css';

function ChatModal({ post, user, onClose }) {
    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        if (!message.trim()) {
            return;
        }

        try {
            const chatData = {
                buyer_id: user.id,
                seller_id: post.user_id,
                post_id: post.id,
                postImage: post.picture, // Include postImage
                postTitle: post.title,   // Include postTitle
                user_email: user.email   // Include user_email
            };

            const res = await axios.post('http://localhost:8081/createChat', chatData);

            const chatId = res.data.chat_id;

            const messageData = {
                chat_id: chatId,
                buyer_id: user.id,
                seller_id: post.user_id,
                post_id: post.id,
                postImage: post.picture, // Ensure the post image and title are sent
                postTitle: post.title,
                message: message,
                user_email: user.email
            };

            await axios.post('http://localhost:8081/messages', messageData);

            onClose(); // Close the modal after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Function to handle click on overlay background
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();  // Close modal if the overlay is clicked
        }
    };

    return (
        <div className="chat-modal-overlay" onClick={handleOverlayClick}>
            <div className="chat-modal">
                <div className="chat-modal-header">
                    <h2>Contact Seller</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="chat-modal-body">
                    <div className="post-preview-container">
                        <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image-preview" />
                        <div className="post-info">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                        </div>
                    </div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-textarea"
                    />
                </div>
                <div className="chat-modal-footer">
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatModal;
