import StoreKeys from './StoreKey';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';

export default function DeleteKeys() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleDeleteKeys = async () => {
        if (confirm("Are you sure you want to delete your keypair? This action cannot be undone.")) {
            setLoading(true); // Start loading
            try {
                const db = await StoreKeys().openDatabase();
                const transaction = db.transaction("keys", "readwrite");
                const store = transaction.objectStore("keys");
                const deleteRequest = store.delete("keypair");

                deleteRequest.onsuccess = () => {
                    toast({
                        title: "Keypair Deleted",
                        description: "Your keypair has been successfully deleted.",
                    });
                };

                deleteRequest.onerror = () => {
                    toast({
                        title: "Deletion Failed",
                        description: "An error occurred while deleting the keypair.",
                    });
                };

                transaction.oncomplete = () => db.close();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error : any) {
                toast({
                    title: "Error",
                    description: `An error occurred: ${error.message || "Unknown error"}`,
                });
            } finally {
                setLoading(false); // End loading
            }
        }
    };

    return (
        <div>
            <Button onClick={handleDeleteKeys} disabled={loading}>
                {loading ? "Deleting..." : "Delete Keypair"}
            </Button>
        </div>
    );
}
