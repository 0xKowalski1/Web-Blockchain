import Block from "./Block";

onmessage = async function (e) {
  const { action, lastBlock, transactions } = e.data;

  if (action === "MINE") {
    const block = await Block.mineBlock({ lastBlock, transactions });

    postMessage({
      action: "MINED",
      block,
    });
  }
};
