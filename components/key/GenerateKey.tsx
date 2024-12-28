import { MaciKeyGenerator } from "../lib/generate";
import { KeyStorage } from "../lib/store";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { buildEddsa } from "circomlibjs";
import crypto from 'crypto';

export function GenerateKey() {
    const [newKeyName, setNewKeyName] = useState('');
    const [loading, setLoading] = useState(false);

    const NewKey = async () => {
        const eddsa = await buildEddsa();
        const prvkey = crypto.randomBytes(32)
        const pubkey = eddsa.prv2pub(prvkey)
        console.log("private key ",prvkey);
        console.log("public key ",pubkey)
    }

    const handleGenerateKey = async () => {
        console.log("hello")
        // if (!newKeyName) {
        //     console.log("no name")
        //     toast.error("Please enter a key name");
        //     return;
        // }

        try {
            setLoading(true);
            console.log("Initializing key generator...");
            // Initialize key generator
            const keyGenerator = await MaciKeyGenerator.initialize();
            console.log("Key generator initialized:", keyGenerator);
            
            console.log("Generating key pair...");
            // Generate key pair
            const keyPair = await keyGenerator.generateKeyPair();
            console.log("Key pair generated:", keyPair);
            
            console.log("Storing key...");
            // Store the key
            KeyStorage.storeKey(keyPair, newKeyName);
            console.log("Key stored:", newKeyName);
            // Clear input and show success message
            setNewKeyName('');
            toast.success("Key generated successfully");
            
        } catch (error) {
            console.error('Key generation error:', error);
            toast.error("Failed to generate key");
        } finally {
            setLoading(false);
            console.log("yo")
        }
        console.log("bye")
    };

    return(
        <div>
            <Button onClick={async () => {
                await NewKey()
            }}>Generate Key</Button>
        </div>
    )
}