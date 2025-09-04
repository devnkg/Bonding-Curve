
````markdown
# Bonding Curve Blockchain

Hardhat project for deploying and interacting with a **Bonding Curve ERC-20 Token** on Ethereum.

---

## 1. Prerequisites

- Node.js ≥ 18
- npm
- Sepolia test ETH (for deployment & testing)
- MetaMask wallet with private key

---

## 2. Environment Setup

Create `.env` in this folder:

```ini
SEPOLIA_RPC_URL=<<your sepolia https rpc url>>
PRIVATE_KEY=<<your wallet private key without 0x>>
ETHERSCAN_API_KEY=<<optional for contract verification>>
CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
````

---

## 3. Install & Compile

```bash
npm install
npx hardhat compile
```

---

## 4. Run Tests

```bash
npx hardhat test
```

---

## 5. Deploy (Optional – already deployed)

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

> If redeployed, update the new address in:
>
> * `.env` here
> * `bonding-curve-frontend/.env`

---

## 6. Demo Script

To simulate buy/sell on Sepolia:

```bash
npx hardhat run scripts/demo.ts --network sepolia
```

---

## 7. Export ABI for Frontend

After compile, copy ABI file to frontend:

```bash
cp artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json \
   ../bonding-curve-frontend/src/abi.json
```

---

## 8. Useful Scripts

Add to `package.json`:

```json
"scripts": {
  "compile": "hardhat compile",
  "test": "hardhat test",
  "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
  "demo:sepolia": "hardhat run scripts/demo.ts --network sepolia"
}
```

