const hexToBuffer = (hexString) => {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
    bytes[j] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes.buffer;
};

export default hexToBuffer;
