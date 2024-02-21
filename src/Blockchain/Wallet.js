function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hexString) {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  ).buffer;
}

class Wallet {
  constructor(keyPair) {
    this.keyPair = keyPair || null;
  }

  async generateKeyPair() {
    this.keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"]
    );
  }

  async publicKey(hex = false) {
    const publicKey = await window.crypto.subtle.exportKey(
      "raw",
      this.keyPair.publicKey
    );

    if (hex) {
      return bufferToHex(publicKey);
    } else {
      return publicKey;
    }
  }

  async signTransaction(transaction) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(transaction));

    const signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      this.keyPair.privateKey,
      data
    );

    return bufferToHex(signature);
  }
}

export default Wallet;
