import Block from "./Block";

onmessage = async function (e) {
  const { action, lastBlock } = e.data;

  if (action === "MINE") {
    const block = await Block.mineBlock(lastBlock);

    postMessage({
      action: "MINED",
      block,
    });
  }
};
