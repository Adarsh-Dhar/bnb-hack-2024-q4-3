export interface KeyPair {
    privateKey: Buffer;
    publicKey: bigint[];
}

export interface StoredKeyPair {
    id: string;
    privateKey: string; // hex string
    publicKey: string[]; // array of two strings
    createdAt: number;
    name: string;
    status: 'active' | 'deactivated';
}