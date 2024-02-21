const { v1: uuidv1 } = require("uuid");

class Transaction {
  constructor({ id, to, from, data, value, timestamp, signature }) {
    this.id = id || uuidv1();
    this.to = to; // if no to, contract creation

    if (!from) throw new Error("No 'from'!");
    this.from = from;

    this.data = data || "";

    if (!value) throw new Error("No 'value'!"); //no 0 values either
    this.value = value;

    this.timestamp = timestamp || new Date();
    this.signature = signature || null;
  }

  //Static Methods
  static rewardTransaction = (to) =>
    new Transaction({
      from: "---rewardaddressmakemeaconstant---",
      to,
      value: 1000,
    });

  //Instance Methods
  validTransaction = () => {
    //hard
    return true;
  };
}

export default Transaction;
