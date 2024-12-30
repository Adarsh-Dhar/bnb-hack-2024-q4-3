import { openDatabase } from '../db/db';
import { KeyPair } from '../types/types';

export function useKeyStore() {
    async function storeKeys(publicKey: string, privateKey: string, status: string): Promise<void> {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readwrite");
        const store = transaction.objectStore("keys");

        store.put({
            publicKey,
            privateKey,
            timestamp: Date.now(),
            status
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                db.close();
                resolve();
            };
            transaction.onerror = () => {
                db.close();
                reject(transaction.error);
            };
        });
    }

    async function getKeys(): Promise<KeyPair | null> {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readonly");
        const store = transaction.objectStore("keys");

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                const keys = request.result as KeyPair[];
                db.close();
                if (keys.length > 0) {
                    resolve(keys[keys.length - 1]);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                db.close();
                reject(request.error);
            };
        });
    }

    async function getAllKeys(): Promise<KeyPair[]> {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readonly");
        const store = transaction.objectStore("keys");

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                const keys = request.result as KeyPair[];
                db.close();
                resolve(keys);
            };

            request.onerror = () => {
                db.close();
                reject(request.error);
            };
        });
    }

    async function deleteKey(id: number): Promise<void> {
        try {
            const db = await openDatabase();
            const transaction = db.transaction("keys", "readwrite");
            const store = transaction.objectStore("keys");

            return new Promise((resolve, reject) => {
                const request = store.delete(id);

                request.onsuccess = () => {
                    db.close();
                    resolve();
                };

                request.onerror = () => {
                    db.close();
                    reject(new Error(`Failed to delete key with id ${id}`));
                };
            });
        } catch (error) {
            console.error(error);
        }
    }

    return { storeKeys, getKeys, getAllKeys, deleteKey };
}
