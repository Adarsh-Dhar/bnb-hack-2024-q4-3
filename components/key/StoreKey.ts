export default function StoreKeys() {
    interface KeyPair {
        publicKey: string;
        privateKey: string;
        timestamp: number;
    }

    async function openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("KeyManagementDB", 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("keys")) {
                    db.createObjectStore("keys", { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function storeKeys(publicKey: Buffer, privateKey: Buffer): Promise<void> {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readwrite");
        const store = transaction.objectStore("keys");

        store.put({
            publicKey,
            privateKey,
            timestamp: Date.now(),
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
            const request = store.getAll(); // Fetch all keys; modify as needed.

            request.onsuccess = () => {
                const keys = request.result as KeyPair[];
                if (keys.length > 0) {
                    resolve(keys[keys.length - 1]); // Return the most recent key pair.
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
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
        try{
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
        }catch(error) {
            console.error(error)
        }
       
    }


    return { storeKeys, getKeys, openDatabase, getAllKeys, deleteKey };
}
