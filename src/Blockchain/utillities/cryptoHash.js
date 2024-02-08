const cryptoHash = async (...inputs) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputs.map(JSON.stringify).sort().join(" "));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export default cryptoHash;
