/* eslint-disable @typescript-eslint/no-explicit-any */
import nacl from "tweetnacl";
import { decodeUTF8, encodeBase64 } from "tweetnacl-util";
import StoreKeys from './StoreKey';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast";

export default function SignMessage() {
    const { toast } = useToast();

    const signMessage = async () => {
        try {
            const keys = await StoreKeys().getKeys();

            if (!keys) {
                toast({
                    title: "No keys found",
                    description: "Generate a new keypair first.",
                });
                return;
            }

            // Convert private key from hex to Uint8Array
            const privateKeyHex = keys.privateKey;
            if (!privateKeyHex) {
                toast({
                    title: "Error",
                    description: "Private key is missing or invalid.",
                });
                return;
            }

            const privateKey = Buffer.from(privateKeyHex, "hex"); // Adjust if private key is stored in a different format

            const message = "Hello, this is a test message!";
            const signature = nacl.sign.detached(decodeUTF8(message), privateKey);

            toast({
                title: "Message Signed",
                description: `Signature: ${encodeBase64(signature)}`,
            });

        } catch (error : any) {
            toast({
                title: "Signing Failed",
                description: `An error occurred: ${error.message || "Unknown error"}`,
            });
        }
    };

    return (
        <div>
            <Button onClick={signMessage}>
                Sign Message
            </Button>
        </div>
    );
}
