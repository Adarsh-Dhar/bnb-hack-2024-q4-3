export function hexToUint8Array(hex: string): Uint8Array {
    if (hex.startsWith('0x')) {
      hex = hex.slice(2);
    }
    if (hex.length % 2 !== 0) {
      throw new Error('Invalid hex string.');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  export function Uint8ArrayToHex(array: Uint8Array): string {
    return Array.from(array)
      .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to a hex string and pad with '0' if needed
      .join(''); // Join the hex strings into a single string
  }