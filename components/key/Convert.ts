export function hexToUint8Array(hexString: string): Uint8Array {
    // Remove '0x' prefix if present
    const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    // Ensure even length
    const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
    const numbers = new Uint8Array(paddedHex.length / 2);
    
    for (let i = 0; i < paddedHex.length; i += 2) {
      numbers[i / 2] = parseInt(paddedHex.slice(i, i + 2), 16);
    }
    
    return numbers;
  }

  // Helper function to convert Uint8Array to hex string
export function uint8ArrayToHex(bytes: Uint8Array): string {
    return '0x' + Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }