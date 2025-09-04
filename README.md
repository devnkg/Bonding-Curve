
````markdown
# Bonding Curve

This project implementing a **Bonding Curve ERC-20 Token** with:  
- 🖥 **Frontend**: React + Vite + Ethers.js  
- ⚙️ **Blockchain**: Hardhat + TypeScript on Sepolia  

---

## 🚀 Quick Start (Frontend Only)

```bash
cd bonding-curve-frontend
npm install
npm run dev
````

Open: [http://localhost:5173](http://localhost:5173)
👉 Make sure `.env` has the deployed contract address:

```ini
VITE_CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
```

---

## 📦 Full Setup

### 1. Blockchain (Hardhat + TypeScript)

```bash
cd bonding-curve-blockchain
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network sepolia
```

Create `.env` in `bonding-curve-blockchain`:

```ini
SEPOLIA_RPC_URL=<<your sepolia rpc url>>
PRIVATE_KEY=<<your wallet private key (no 0x)>>
ETHERSCAN_API_KEY=<<optional>>
CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
```

📌 **Note:**

* Contract deployment uses **TypeScript script** → `scripts/deploy.ts`
* Tests are written in **TypeScript** → `test/BondingCurveToken.test.ts`

---

### 2. Export ABI

Copy ABI from blockchain to frontend:

```bash
cp bonding-curve-blockchain/artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json \
   bonding-curve-frontend/src/abi.json
```

---

### 3. Frontend (React + Vite)

```bash
cd bonding-curve-frontend
npm install
npm run dev
```

Open: http://localhost:5173 👉 Make sure .env has the deployed contract address:

Create `.env` in `bonding-curve-frontend`:

```ini
VITE_CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
```

---

## ✨ Features

* 🔌 Connect / Disconnect MetaMask
* 📊 View token stats (price, supply, balance)
* 🛒 Buy tokens with ETH
* 💸 Sell tokens for ETH

---

## 📜 License

MIT

