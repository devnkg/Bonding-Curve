import { ethers } from "hardhat";

async function main() {
  const [user] = await ethers.getSigners();
  const address = process.env.CONTRACT_ADDRESS!;
  const abi = (await import("../artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json")).abi;
  const c = new ethers.Contract(address, abi, user);

  console.log("User:", user.address);

  // 1) Buy with 0.01 ETH
  const ethIn = ethers.parseEther("0.01");
  const estTokens = await c.previewBuy(ethIn);
  console.log("Preview tokens out:", estTokens.toString());
  const tx1 = await c.buy(estTokens * 99n / 100n, { value: ethIn }); // 1% slippage
  console.log("buy tx:", tx1.hash);
  await tx1.wait();

  const bal = await c.balanceOf(user.address);
  console.log("Token balance:", bal.toString());

  // 2) Sell half
  const sellAmount = bal / 2n;
  const estEth = await c.previewSell(sellAmount);
  console.log("Preview ETH out:", estEth.toString());
  const tx2 = await c.sell(sellAmount, estEth * 99n / 100n);
  console.log("sell tx:", tx2.hash);
  await tx2.wait();

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
