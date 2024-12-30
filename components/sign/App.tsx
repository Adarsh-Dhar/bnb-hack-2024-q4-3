import React, { useState } from 'react';
import { KeyManagementUI } from './KeyManagementUI';

const App: React.FC = () => {
    const [privateKey, setPrivateKey] = useState('');
    const [message, setMessage] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <KeyManagementUI 
                privateKey={privateKey}
                message={message}
                onPrivateKeyChange={setPrivateKey}
                onMessageChange={setMessage}
            />
        </div>
    );
};

export default App;