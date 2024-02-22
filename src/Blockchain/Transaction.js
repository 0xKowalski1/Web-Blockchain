import { REWARDADDRESS, REWARDAMOUNT } from "./config";
import hexToBuffer from "./utillities/hexToBuffer";

const { v1: uuidv1 } = require("uuid");

class Transaction {
  constructor({ id, to, from, data, value, timestamp, signature }) {
    this.id = id || uuidv1();
    this.to = to; // if no to, contract creation

    if (!from) throw new Error("No 'from'!");
    this.from = from;

    this.data = data || "";

    if (!value) throw new Error("No 'value'!");
    this.value = value;

    this.timestamp = timestamp || new Date();
    this.signature = signature || null;
  }

  //Static Methods
  static rewardTransaction = (to) =>
    new Transaction({
      from: REWARDADDRESS,
      to,
      value: REWARDAMOUNT,
    });

  //Instance Methods
  validTransaction = async () => {
    if (this.from === REWARDADDRESS) return true; //validated in run transactions
    if (!this.signature) return false;

    const publicKey = await window.crypto.subtle.importKey(
      "raw",
      hexToBuffer(this.from),
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({ ...this, signature: null }));

    const signatureBuffer = hexToBuffer(this.signature);

    try {
      const isValid = await window.crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: { name: "SHA-256" },
        },
        publicKey,
        signatureBuffer,
        data
      );

      return isValid;
    } catch (error) {
      return false;
    }
  };
}

export default Transaction;
