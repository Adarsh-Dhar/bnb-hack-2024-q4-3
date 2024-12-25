"use client"

import nacl from 'tweetnacl';
import { Button } from '../ui/button';
import { useStore } from "../zustand";
import { useToast } from "@/components/ui/use-toast"


export default function GenerateKey() {
    const keyPair = nacl.sign.keyPair();
    const updatePublicKey = useStore((key) => key.setPubKey())
    const updatePrivateKey = useStore((key) => key.setPrivKey())
    const { toast } = useToast()

    return(
        <div>
            <Button onClick={() => {
                const newPubKey = Buffer.from(keyPair.publicKey).toString('hex').toString()
                const newPrivKey = Buffer.from(keyPair.secretKey).toString('hex').toString()
                updatePublicKey(newPubKey)
                updatePrivateKey(newPrivKey)
                toast({
                    title: newPubKey,
                    description: newPrivKey,
                    
                  })
            }}>Generate Key</Button>
        </div>
    )
}