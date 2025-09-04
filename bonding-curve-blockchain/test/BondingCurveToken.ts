import { expect } from "chai";
import { ethers } from "hardhat";
import { BondingCurveToken } from "../typechain-types";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";


describe("BondingCurveToken", function () {
  let token: BondingCurveToken;
  let owner: any, user1: any, user2: any;

  const BASE_PRICE = ethers.parseEther("0.001"); // 0.001 ETH per token
  const SLOPE = BigInt(10 ** 12);                // slope factor
  const MAX_SUPPLY = ethers.parseEther("1000000"); // 1M tokens

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("BondingCurveToken");
    token = (await Token.deploy(
        "Bonding Curve Token",
        "BOND",
        BASE_PRICE,
        SLOPE,
        MAX_SUPPLY
    )) as unknown as BondingCurveToken;
    await token.waitForDeployment();
  });

  it("should deploy with correct parameters", async () => {
    expect(await token.basePrice()).to.equal(BASE_PRICE);
    expect(await token.slope()).to.equal(SLOPE);
    expect(await token.maxSupply()).to.equal(MAX_SUPPLY);
    expect(await token.circulatingSupply()).to.equal(0n);
  });

  it("should return correct current price initially", async () => {
    const price = await token.currentPrice();
    expect(price).to.equal(BASE_PRICE);
  });

  it("should allow user to buy tokens", async () => {
    const ethIn = ethers.parseEther("0.01");

    const estTokens = await token.connect(user1).previewBuy(ethIn);
    expect(estTokens).to.be.gt(0n);

    const tx = await token.connect(user1).buy(estTokens * 99n / 100n, { value: ethIn });
    await tx.wait();

    const balance = await token.balanceOf(user1.address);
    expect(balance).to.be.gt(0n);
  });

  it("should emit Bought event on buy", async () => {
    const ethIn = ethers.parseEther("0.01");
    const estTokens = await token.connect(user1).previewBuy(ethIn);

    await expect(token.connect(user1).buy(estTokens * 99n / 100n, { value: ethIn }))
      .to.emit(token, "Bought")
      .withArgs(user1.address, ethIn, anyValue, anyValue); // use anyValue matcher
  });

  it("should allow user to sell tokens", async () => {
    const ethIn = ethers.parseEther("0.01");
    const estTokens = await token.connect(user1).previewBuy(ethIn);
    await token.connect(user1).buy(estTokens, { value: ethIn });

    const bal = await token.balanceOf(user1.address);
    const sellAmount = bal / 2n;

    const estEth = await token.connect(user1).previewSell(sellAmount);

    const tx = await token.connect(user1).sell(sellAmount, estEth * 99n / 100n);
    await tx.wait();

    const balAfter = await token.balanceOf(user1.address);
    expect(balAfter).to.be.lt(bal);
  });

  it("should emit Sold event on sell", async () => {
    const ethIn = ethers.parseEther("0.01");
    const estTokens = await token.connect(user1).previewBuy(ethIn);
    await token.connect(user1).buy(estTokens, { value: ethIn });

    const bal = await token.balanceOf(user1.address);
    const sellAmount = bal / 2n;
    const estEth = await token.connect(user1).previewSell(sellAmount);

    await expect(token.connect(user1).sell(sellAmount, estEth * 99n / 100n))
      .to.emit(token, "Sold")
      .withArgs(user1.address, sellAmount, anyValue, anyValue);
  });

  it("should revert if buying without ETH", async () => {
    await expect(token.connect(user1).buy(1n, { value: 0 }))
      .to.be.revertedWith("No ETH sent");
  });

  it("should revert if selling more than balance", async () => {
    await expect(token.connect(user1).sell(1000n, 1n))
      .to.be.revertedWith("Insufficient balance");
  });

 it("should not exceed max supply", async () => {
  const [ , user ] = await ethers.getSigners();
  const CheapToken = await ethers.getContractFactory("BondingCurveToken");
  const basePrice = 1n; 
  const slope = 0n;
  const maxSupply = ethers.parseUnits("1000", 18); 

  const cheap = await CheapToken.deploy("Cheap", "CHP", basePrice, slope, maxSupply);
  await cheap.waitForDeployment();

  await cheap.connect(user).buy(0, { value: 1000n });
  await expect(
    cheap.connect(user).buy(0, { value: 1n })
  ).to.be.revertedWith("Exceeds max supply");
});
});
