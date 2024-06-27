const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyTokenModule", (m) => {
  const name = m.getParameter("name", process.env.NAME);
  const symbol = m.getParameter("symbol", process.env.SYMBOL);
  const decimals = m.getParameter("decimals", process.env.DECIMALS);
  const supply = m.getParameter("supply", process.env.SUPPLY);
  const myToken = m.contract("MyToken", [name, symbol, decimals, supply]);
  return { myToken };
});
