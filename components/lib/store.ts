import { KeyPair, StoredKeyPair } from './types';

export class KeyStorage {
    private static STORAGE_KEY = 'maci-keys';

    static getAllKeys(): StoredKeyPair[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static storeKey(keyPair: KeyPair, name: string): StoredKeyPair {
        const keys = this.getAllKeys();
        
        const newKey: StoredKeyPair = {
            id: crypto.randomUUID(),
            privateKey: keyPair.privateKey.toString('hex'),
            publicKey: [
                keyPair.publicKey[0].toString(),
                keyPair.publicKey[1].toString()
            ],
            createdAt: Date.now(),
            name,
            status: 'active'
        };

        localStorage.setItem(
            this.STORAGE_KEY, 
            JSON.stringify([...keys, newKey])
        );

        return newKey;
    }

    static deleteKey(id: string): void {
        const keys = this.getAllKeys();
        const filtered = keys.filter(key => key.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

    static deactivateKey(id: string): void {
        const keys = this.getAllKeys();
        const updated = keys.map(key => 
            key.id === id ? { ...key, status: 'deactivated' as const } : key
        );
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
}
