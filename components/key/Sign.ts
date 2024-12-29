import { sign, signAsync, verify, verifyAsync } from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import * as ed from '@noble/ed25519';

// Configure SHA-512 for ed25519
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.concatBytes(...m));

// Convert numeric string to Uint8Array (for private keys)
function numericToUint8Array(numeric: string): Uint8Array {
  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);
  const bigInt = BigInt(numeric);
  for (let i = 0; i < 32; i++) {
    view.setUint8(31 - i, Number(bigInt >> BigInt(i * 8) & BigInt(255)));
  }
  return new Uint8Array(buffer);
}

// Convert hex string to Uint8Array
function hexToUint8Array(hexString: string): Uint8Array {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
  const numbers = new Uint8Array(paddedHex.length / 2);
  
  for (let i = 0; i < paddedHex.length; i += 2) {
    numbers[i / 2] = parseInt(paddedHex.slice(i, i + 2), 16);
  }
  
  return numbers;
}

// Convert Uint8Array to hex string
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function signMessage(
  message: string,
  privateKey: string,
  asyncMode: boolean = false
): Promise<string> {
  if (!message || !privateKey) {
    throw new Error('Message and private key are required.');
  }

  try {
    // Handle both numeric and hex private keys
    const privateKeyBytes = privateKey.startsWith('0x') 
      ? hexToUint8Array(privateKey)
      : numericToUint8Array(privateKey);

    if (privateKeyBytes.length !== 32) {
      throw new Error('Private key must be 32 bytes');
    }

    // Convert message to bytes
    const messageBytes = message.startsWith('0x')
      ? hexToUint8Array(message)
      : new TextEncoder().encode(message);

    // Sign the message
    const signature = asyncMode
      ? await signAsync(messageBytes, privateKeyBytes)
      : sign(messageBytes, privateKeyBytes);

    return uint8ArrayToHex(signature);
  } catch (error) {
    throw new Error(`Signing failed: ${(error as Error).message}`);
  }
}

export async function verifyMessage(
  signature: string,
  message: string,
  publicKey: string,
  asyncMode: boolean = false
): Promise<boolean> {
  if (!signature || !message || !publicKey) {
    throw new Error('Signature, message, and public key are required.');
  }

  try {
    const signatureBytes = hexToUint8Array(signature);
    const publicKeyBytes = hexToUint8Array(publicKey);
    const messageBytes = message.startsWith('0x')
      ? hexToUint8Array(message)
      : new TextEncoder().encode(message);

    return asyncMode
      ? await verifyAsync(signatureBytes, messageBytes, publicKeyBytes)
      : verify(signatureBytes, messageBytes, publicKeyBytes);
  } catch (error) {
    throw new Error(`Verification failed: ${(error as Error).message}`);
  }
}

