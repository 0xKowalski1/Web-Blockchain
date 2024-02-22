import bufferToHex from "./utillities/bufferToHex";

class Wallet {
  constructor() {
    this.keyPair = null;
    this.publicKey = null;
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

    const publicKey = await window.crypto.subtle.exportKey(
      "raw",
      this.keyPair.publicKey
    );

    this.publicKey = bufferToHex(publicKey);
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
