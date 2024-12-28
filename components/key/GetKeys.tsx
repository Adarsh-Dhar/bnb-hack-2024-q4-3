import StoreKeys from './StoreKey';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';

export default function GetKeys() {
    const { toast } = useToast();
    const { getKeys } = StoreKeys();
    const [loading, setLoading] = useState(false);

    const handleViewKeys = async () => {
        setLoading(true); // Start loading
        try {
            const keys = await getKeys();
            if (keys) {
                const { publicKey, privateKey } = keys;
                toast({
                    title: "Your Keys",
                    description: `Public Key:\n${publicKey}\n\nPrivate Key:\n${privateKey}`,
                });
            } else {
                toast({
                    title: "No Keys Found",
                    description: "Generate a new keypair first.",
                });
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error : any) {
            toast({
                title: "Error Fetching Keys",
                description: `An error occurred: ${error.message || "Unknown error"}`,
            });
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <Button onClick={handleViewKeys} disabled={loading}>
            {loading ? "Loading..." : "View Keypair"}
        </Button>
    );
}
