
````markdown
# Bonding Curve Blockchain

Hardhat project to deploy and interact with a **Bonding Curve ERC-20 Token** on Sepolia.

---

## Prerequisites
- Node.js ≥ 18, npm  
- MetaMask wallet with private key  
- Sepolia test ETH ([faucet](https://sepoliafaucet.com))  
- (Optional) Etherscan API key  

---

## Setup
Create a `.env` file:

```ini
SEPOLIA_RPC_URL=<<your sepolia rpc url>>
PRIVATE_KEY=<<your wallet private key (no 0x)>>
ETHERSCAN_API_KEY=<<optional>>
CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
````

---

## Install & Compile

```bash
npm install
npx hardhat compile
```

---

## Test

```bash
npx hardhat test
```

---

## Deploy

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Update new address in `.env` and `bonding-curve-frontend/.env` if redeployed.

---

## Demo

```bash
npx hardhat run scripts/demo.ts --network sepolia
```

---

## Frontend

Export ABI:

```bash
cp artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json \
   ../bonding-curve-frontend/src/abi.json
```

