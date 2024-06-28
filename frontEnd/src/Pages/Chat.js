import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ chatId, selectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setUserId(user.id);
        }

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/messages/${chatId}`);
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };

        fetchMessages();
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            await axios.post('http://localhost:8081/messages', {
                chat_id: chatId,
                user_email: JSON.parse(localStorage.getItem('user')).email,
                message: newMessage
            });
            setMessages([...messages, { message: newMessage, user_email: JSON.parse(localStorage.getItem('user')).email }]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div className="chat-container">
            {selectedChat && (
                <div className="chat-header">
                    <img src={`http://localhost:8081/${selectedChat.profile_pic}`} alt={selectedChat.name} className="chat-header-pic" />
                    <h2 className="chat-header-name">{selectedChat.name}</h2>
                </div>
            )}
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.user_email === JSON.parse(localStorage.getItem('user')).email ? 'message own' : 'message'}>
                        <div className="message-content">
                            <span>{msg.message}</span>
                        </div>
                    </div>
                ))}
            </div>
            <form className="new-message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">Send</button>
            </form>
        </div>
    );
};

export default Chat;
