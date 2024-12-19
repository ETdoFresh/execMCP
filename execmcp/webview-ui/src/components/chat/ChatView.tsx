import React, { useState, useEffect } from 'react';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import ChatTextArea from './ChatTextArea';
import ChatRow from './ChatRow';
import './Chat.css';

interface Message {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
}

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Handle messages from the extension
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'response':
                    setMessages(msgs => [...msgs, {
                        role: 'assistant',
                        content: message.content,
                        timestamp: Date.now()
                    }]);
                    break;
                case 'toolResponse':
                    setMessages(msgs => [...msgs, {
                        role: 'tool',
                        content: message.content,
                        timestamp: Date.now()
                    }]);
                    break;
            }
        };

        window.addEventListener('message', messageHandler);

        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, []);

    const handleSubmit = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            role: 'user',
            content: inputValue,
            timestamp: Date.now()
        };

        setMessages([...messages, newMessage]);
        // Send message to extension
        vscode.postMessage({
            type: 'mcpRequest',
            message: inputValue
        });
        setInputValue('');
    };

    return (
        <div className="chat-view">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <ChatRow
                        key={index}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                    />
                ))}
            </div>
            <div className="chat-input">
                <ChatTextArea
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleSubmit}
                />
                <div onClick={handleSubmit}>
                    <VSCodeButton
                        appearance="primary"
                        aria-label="Send message"
                    >
                        Send
                    </VSCodeButton>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
