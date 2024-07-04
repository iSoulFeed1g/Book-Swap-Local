import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inbox.css';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Chat from './Chat'; // Import the Chat component

function Inbox() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const { chatId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            axios.get(`http://localhost:8081/inbox/${user.id}`)
                .then(res => {
                    setChats(res.data);
                })
                .catch(err => {
                    console.error("Error fetching inbox:", err);
                });
        }
    }, [user]);

    useEffect(() => {
        if (chatId && chats.length) {
            const chat = chats.find(chat => chat.id === parseInt(chatId));
            if (chat) {
                setSelectedChat(chat);
            }
        }
    }, [chatId, chats]);

    const handleChatClick = (chat) => {
        setSelectedChat(chat);
        navigate(`/inbox/${chat.id}`);
    };

    const handleSearch = (query) => {
        console.log('Search query:', query);
    };

    return (
        <Layout onSearch={handleSearch}>
            <div className="inbox-page">
                <div className="inbox-sidebar">
                    <h1>Inbox</h1>
                    <div className="inbox-list">
                        {chats.map(chat => (
                            chat.name !== user.name && (
                                <div key={chat.id} onClick={() => handleChatClick(chat)} className={`inbox-item ${selectedChat && selectedChat.id === chat.id ? 'active' : ''}`}>
                                    <img src={`http://localhost:8081/${chat.profile_pic}`} alt={chat.name} className="inbox-profile-pic" />
                                    <div className="inbox-text">
                                        <p className={chat.lastMessageSender === user.id ? "" : "bold"}>{chat.name}</p>
                                        <p className="last-message">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div className="chat-area">
                    {selectedChat ? (
                        <div>
                            <Chat key={selectedChat.id} chatId={selectedChat.id} selectedChat={selectedChat} />
                        </div>
                    ) : (
                        <div className="welcome-message">
                            <h2>Your messages</h2>
                            <p>Send a message to start a chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Inbox;
