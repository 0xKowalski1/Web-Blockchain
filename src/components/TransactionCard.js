import React from "react";

const TransactionCard = ({ id, to, from, data, value, timestamp }) => (
  <div>
    {from}-{to}-{value}
  </div>
);
export default TransactionCard;
