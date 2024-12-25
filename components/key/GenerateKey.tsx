import nacl from 'tweetnacl';

export default function GenerateKey() {
    const keyPair = nacl.sign.keyPair();
    return(
        <div>
            <p>public key: {Buffer.from(keyPair.publicKey).toString('hex')}</p>
            <p>private key: {Buffer.from(keyPair.secretKey).toString('hex')}</p>
        </div>
    )
}