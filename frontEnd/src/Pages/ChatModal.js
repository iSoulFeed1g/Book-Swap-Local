// ChatModal.js
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
            // Create or get chat ID
            const res = await axios.post('http://localhost:8081/createChat', {
                buyer_id: user.id,
                seller_id: post.user_id
            });

            const chatId = res.data.chat_id;

            // Send message
            await axios.post('http://localhost:8081/messages', {
                chat_id: chatId,
                user_email: user.email,
                message,
                post_id: post.id // Add post_id to identify the post in the inbox
            });

            onClose(); // Close the modal after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <div className="chat-modal-header">
                    <h2>Contact Seller</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="chat-modal-body">
                    <div className="post-preview">
                        <img src={`http://localhost:8081/${post.picture}`} alt={post.title} className="post-image-small" />
                        <div>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                        </div>
                    </div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
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
