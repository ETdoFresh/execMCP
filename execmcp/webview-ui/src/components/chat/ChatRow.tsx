import React from 'react';
import './Chat.css';

interface ChatRowProps {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
}

const ChatRow: React.FC<ChatRowProps> = ({ role, content, timestamp }) => {
    return (
        <div className={`chat-row ${role}`}>
            <div className="chat-bubble">
                <div className="chat-header">
                    <span className="chat-role">{role}</span>
                    <span className="chat-time">
                        {new Date(timestamp).toLocaleTimeString()}
                    </span>
                </div>
                <div className="chat-content">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default ChatRow;
