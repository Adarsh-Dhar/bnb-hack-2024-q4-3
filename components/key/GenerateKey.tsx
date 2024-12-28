
import { useState } from "react";
import { Button } from "../ui/button";
import StoreKeys from "./StoreKey";
import { buildEddsa } from "circomlibjs";
import crypto from 'crypto';

export function GenerateKey() {
    const {storeKeys, getKeys} = StoreKeys()
    const [newKeyName, setNewKeyName] = useState('');
    const [loading, setLoading] = useState(false);

    const NewKey = async () => {
        const eddsa = await buildEddsa();
        const prvkey = crypto.randomBytes(32)
        const pubkey = eddsa.prv2pub(prvkey)
        const finalPubKey = Buffer.concat([pubkey[0], pubkey[1]]);
        console.log("private key ",prvkey);
        console.log("public key ",pubkey)
        console.log("final public key ",finalPubKey)
        await storeKeys(finalPubKey,prvkey)
        const get_keys = await getKeys()
        console.log("get keys ",get_keys)
    }


    return(
        <div>
            <Button onClick={async () => {
                await NewKey()
            }}>Generate Key</Button>
        </div>
    )
}