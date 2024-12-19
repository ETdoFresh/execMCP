import React, { useCallback } from 'react';
import { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react';
import './Chat.css';

interface ChatTextAreaProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

const ChatTextArea: React.FC<ChatTextAreaProps> = ({ value, onChange, onSubmit }) => {
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
        }
    }, [onSubmit]);

    return (
        <VSCodeTextArea
            value={value}
            onChange={(e: any) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            resize="vertical"
            style={{
                width: '100%',
                minHeight: '60px',
                maxHeight: '200px'
            }}
        />
    );
};

export default ChatTextArea;
