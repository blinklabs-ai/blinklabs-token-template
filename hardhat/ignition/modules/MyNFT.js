const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTModule", (m) => {
  const name = m.getParameter("name", process.env.NAME);
  const symbol = m.getParameter("symbol", process.env.SYMBOL);

  const myNFT = m.contract("MyNFT", [name, symbol]);

  return { myNFT };
});
