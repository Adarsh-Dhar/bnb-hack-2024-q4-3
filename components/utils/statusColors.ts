import { KeyStatus } from "../types/types";

export const getStatusColor = (status: KeyStatus) => {
    const colors = {
        'Active': 'bg-green-100 text-green-800',
        'Revoked': 'bg-red-100 text-red-800',
        'Expired': 'bg-yellow-100 text-yellow-800',
        'Compromised': 'bg-red-100 text-red-800',
        'Archived': 'bg-gray-100 text-gray-800',
        'Not Initialized': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || '';
};