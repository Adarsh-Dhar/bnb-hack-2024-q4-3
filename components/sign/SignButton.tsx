import { Button } from '@/components/ui/button';
import React from 'react';

interface SignButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const SignButton: React.FC<SignButtonProps> = ({ onClick, disabled }) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
            Sign
        </Button>
    );
};