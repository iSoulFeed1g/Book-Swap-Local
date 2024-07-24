import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ chatId, selectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`http://localhost:8081/messages/${chatId}`)
            .then(res => {
                console.log("Fetched messages:", res.data);
                setMessages(res.data);
            })
            .catch(err => {
                console.error("Error fetching messages:", err);
            });
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messageData = {
            chat_id: chatId,
            user_email: user.email,
            message: newMessage,
            postImage: selectedChat.postImage,
            postTitle: selectedChat.postTitle
        };

        axios.post('http://localhost:8081/messages', messageData)
            .then(res => {
                setMessages([...messages, { ...messageData, timestamp: new Date() }]);
                setNewMessage('');
            })
            .catch(err => {
                console.error("Error sending message:", err);
            });
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <img src={`http://localhost:8081/${selectedChat.profile_pic}`} alt={selectedChat.name} className="chat-profile-pic" />
                <div>
                    <h2>{selectedChat.name}</h2>
                </div>
            </div>
            <div className="chat-messages-container">
                {selectedChat.postImage && (
                    <div className="message-post-info">
                        <img src={`http://localhost:8081/${selectedChat.postImage}`} alt={selectedChat.postTitle} className="message-post-image" />
                        <span>{selectedChat.postTitle}</span>
                    </div>
                )}
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.user_email === user.email ? 'sent' : 'received'}`}>
                            <p>{msg.message}</p>
                            <small className="timestamp">{new Date(msg.timestamp).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
