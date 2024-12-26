"use client";

import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import StoreKeys from "./StoreKey";
import { zKey } from "snarkjs";

export default function GenerateKey() {
    const { toast } = useToast();
    const { storeKeys } = StoreKeys();

    const handleKeyGeneration = async () => {
        try {
            // Replace these with your actual file paths or fetch them appropriately
            const r1csName = "example.r1cs"; // Path to your circuit's .r1cs file
            const ptauName = "powersOfTau.ptau"; // Path to your powers of tau .ptau file
            const zkeyName = "example.zkey"; // Output filename for the .zkey file

            // Step 1: Generate the .zkey file
            const zkey = await zKey.newZKey(r1csName, ptauName, zkeyName);

            // Step 2: Export the verification key
            const vkey = await zKey.exportVerificationKey(zkeyName);

            // Step 3: Store keys securely
            const provingKey = JSON.stringify(zkey);
            const verificationKey = JSON.stringify(vkey);

            console.log(`proving key ${provingKey} ver key ${verificationKey}`)
            storeKeys(provingKey, verificationKey);

            // Step 4: Notify the user
            toast({
                title: "Keys Generated",
                description: "Proving and verification keys have been generated and stored.",
            });
        } catch (error) {
            console.error("Error generating zk-SNARK keys:", error);
            toast({
                title: "Error",
                description: "Failed to generate zk-SNARK keys.",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <Button onClick={handleKeyGeneration}>Generate zk-SNARK Keys</Button>
        </div>
    );
}
