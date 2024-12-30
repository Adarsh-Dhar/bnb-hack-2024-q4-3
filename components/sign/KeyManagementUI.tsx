import React from 'react';
import { useKeyStore } from '../hooks/useKeyStore';
import { KeyInput } from './KeyInput';
import { SignButton } from './SignButton';

interface KeyManagementUIProps {
    privateKey: string;
    message: string;
    onPrivateKeyChange: (value: string) => void;
    onMessageChange: (value: string) => void;
}

export const KeyManagementUI: React.FC<KeyManagementUIProps> = ({
    privateKey,
    message,
    onPrivateKeyChange,
    onMessageChange
}) => {
    const { storeKeys } = useKeyStore();

    const handleSign = async () => {
        if (!privateKey.trim() || !message.trim()) return;
        try {
            await storeKeys(message, privateKey, 'active');
            // Add success handling here
        } catch (error) {
            console.error('Failed to store keys:', error);
            // Add error handling here
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="privateKey" className="text-sm font-medium text-gray-700">
                        Private Key
                    </label>
                    <KeyInput 
                        id="privateKey"
                        value={privateKey}
                        onChange={onPrivateKeyChange}
                        placeholder="Enter private key..."
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <KeyInput 
                        id="message"
                        value={message}
                        onChange={onMessageChange}
                        placeholder="Enter message to sign..."
                    />
                </div>
                <div className="flex justify-end">
                    <SignButton 
                        onClick={handleSign}
                        disabled={!privateKey.trim() || !message.trim()}
                    />
                </div>
            </div>
        </div>
    );
};
