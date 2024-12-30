import React from 'react';

interface KeyInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const KeyInput: React.FC<KeyInputProps> = ({ 
    id, 
    value, 
    onChange, 
    placeholder 
}) => {
    return (
        <textarea
            id={id}
            className="flex-grow p-2 border rounded-md min-h-[100px] resize-y"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};