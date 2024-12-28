
import { useState } from "react";
import { Button } from "../ui/button";
import StoreKeys from "./StoreKey";
import { buildEddsa } from "circomlibjs";
import crypto from 'crypto';

export function GenerateKey() {
    const {storeKeys, getKeys, getAllKeys, deleteKey} = StoreKeys()

    const NewKey = async () => {
        const eddsa = await buildEddsa();
        const prvkey = crypto.randomBytes(32)
        const pubkey = eddsa.prv2pub(prvkey)
        const finalPubKey = Buffer.concat([pubkey[0], pubkey[1]]);
        console.log("private key ",prvkey);
        console.log("public key ",pubkey)
        console.log("final public key ",finalPubKey)
        await storeKeys(finalPubKey,prvkey)
        await deleteKey(4);
        await deleteKey(6)
        const get_keys = await getAllKeys()
        console.log("get keys ",get_keys)
    }

    const DeleteKey = async () => {
        await deleteKey(1);
        await deleteKey(2)
        const get_keys = await getAllKeys()
        console.log("get keys ",get_keys)
    }


    return(
        <div>
            <Button onClick={async () => {
                await NewKey()
            }}>Generate Key</Button>
             <Button onClick={async () => {
                await DeleteKey()
            }}>Delete Key</Button>
        </div>
    )
}