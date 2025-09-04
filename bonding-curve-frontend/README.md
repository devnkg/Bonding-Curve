
````markdown
# Bonding Curve Frontend

Minimal **React + Vite + Ethers.js** app for interacting with the **Bonding Curve ERC-20 Token** on Sepolia.  
Supports MetaMask connection, viewing stats, and buy/sell actions.

---

## Prerequisites
- Node.js ≥ 18  
- npm  
- MetaMask (browser extension, connected to Sepolia)  

---

## Setup
Create a `.env` file:

```ini
VITE_CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
````

> Use the deployed contract address from the blockchain project.

---

## Install & Run

```bash
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## Features

* 🔌 Connect / Disconnect MetaMask
* 📊 View price, supply, and user balance
* 🛒 Buy tokens (enter ETH, get estimate, confirm tx)
* 💸 Sell tokens (enter tokens, get estimate, confirm tx)

---

## ABI

ABI must be copied from the blockchain project after compile:

```bash
cp ../bonding-curve-blockchain/artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json src/abi.json
```

