import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Token = await ethers.getContractFactory("BondingCurveToken");

  const basePrice = ethers.parseUnits("0.001", "ether"); // 0.001 ETH per token
  const slope = ethers.parseUnits("0.0001", "ether");    // slope per token
  const maxSupply = ethers.parseUnits("1000000", 18);    // 1M tokens

  const token = await Token.deploy("Bonding Curve Token", "BCT", basePrice, slope, maxSupply);

  await token.waitForDeployment();

  console.log("BondingCurveToken deployed at:", await token.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
