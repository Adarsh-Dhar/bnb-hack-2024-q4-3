export type KeyStatus = 'Active' | 'Revoked' | 'Expired' | 'Compromised' | 'Archived' | 'Not Initialized';

export interface KeyPair {
    id?: number;
    publicKey: string;
    privateKey: string;
    timestamp: number;
    status: KeyStatus;
}