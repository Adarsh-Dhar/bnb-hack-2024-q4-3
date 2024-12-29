import { sign, signAsync, verifyAsync,verify } from '@noble/ed25519'; 
import { hexToUint8Array } from './Convert';

export function signMessage(
    message: string, 
    privateKey: string, 
    asyncMode: boolean = false
  ): Uint8Array | Promise<Uint8Array> {
    if (!message || !privateKey) {
      throw new Error('Message and private key are required.');
    }
  
    // Convert inputs to Uint8Array if necessary
    const messageBytes = typeof message === 'string' && message.startsWith('0x')
      ? hexToUint8Array(message)
      : new TextEncoder().encode(message);
  
    const privateKeyBytes = hexToUint8Array(privateKey);
  
    // Use synchronous or asynchronous signing based on the asyncMode flag
    if (asyncMode) {
      return signAsync(messageBytes, privateKeyBytes);
    } else {
      return sign(messageBytes, privateKeyBytes);
    }
  }

  export function verifyMessage(
    signature: string,
    message: string,
    publicKey: string,
    asyncVerification: boolean = false,
    options = { zip215: true }
  ): boolean | Promise<boolean> {
    if (asyncVerification) {
      // Perform asynchronous verification
      return verifyAsync(signature, message, publicKey);
    } else {
      // Perform synchronous verification
      return verify(signature, message, publicKey, options);
    }
  }

  