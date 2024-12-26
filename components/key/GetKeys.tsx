import StoreKeys from './StoreKey';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast"

export default function GetKeys() {
    const { toast } = useToast()
    const {getKeys} = StoreKeys() 
    return(
        <Button onClick={async () => {
            const keys = await getKeys();
            if (keys) {
                const publicKey = keys.publicKey;
                const privateKey = keys.privateKey;
                toast({
                    title: "Your Keys",
                    description: `Public Key: ${publicKey}\nPrivate Key: ${privateKey}`,
                });
            } else {
                toast({
                    title: "No keys found",
                    description: "Generate a new keypair first.",
                });
            }
        }}>
            View Keypair
        </Button>
        
    )
}