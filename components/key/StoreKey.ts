export default function StoreKeys() {
    interface KeyPair {
        publicKey: string;
        privateKey: string;
        timestamp: number;
      }
      
    async function openDatabase() {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open("KeyManagementDB", 1);
      
          request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("keys")) {
              db.createObjectStore("keys");
            }
          };
      
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
      
     async function storeKeys(publicKey: ArrayBuffer| string, privateKey: ArrayBuffer | string) {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readwrite");
        const store = transaction.objectStore("keys");
      
        store.put({ publicKey, privateKey, timestamp: Date.now() }, "keypair");
      
        transaction.oncomplete = () => db.close();
      }
      
      async function getKeys(): Promise<KeyPair | null> {
        const db = await openDatabase();
        const transaction = db.transaction("keys", "readonly");
        const store = transaction.objectStore("keys");
      
        return new Promise((resolve, reject) => {
          const request = store.get("keypair");
      
          request.onsuccess = () => {
            if (request.result) {
              resolve(request.result as KeyPair); // Explicitly cast to KeyPair
            } else {
              resolve(null); // No keys found
            }
          };
          request.onerror = () => reject(request.error);
        });
      }

      return {
        storeKeys,getKeys,openDatabase
      }
      
}