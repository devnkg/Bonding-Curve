```markdown
# Bonding Curve Frontend

Minimal React + Vite + Ethers frontend for the **Bonding Curve Token**.  
Connects to MetaMask (Sepolia), displays stats, and allows **buy/sell**.

---

## 1. Prerequisites

- Node.js ≥ 18
- npm
- MetaMask (installed in browser, connected to **Sepolia**)

---

## 2. Environment Setup

Create `.env` in this folder:

```ini
VITE_CONTRACT_ADDRESS=0x17782F1E07980E39f3B49A1F645597DdaA95d945
````

> Must match the deployed contract address from blockchain project.

---

## 3. Install & Run (Dev)

```bash
npm install
npm run dev
```

Open: [http://localhost:5173/](http://localhost:5173/)

---

## 4. Features

* 🔌 Connect / Disconnect MetaMask
* 📊 Display:

  * Current Price
  * Total Supply
  * Circulating Supply
  * User’s Balance
* 🛒 Buy form:

  * Input ETH amount
  * See estimated tokens
  * Confirm buy (shows tx hash)
* 💸 Sell form:

  * Input token amount
  * See estimated ETH
  * Confirm sell (shows tx hash)

---

## 5. ABI Location

ABI must be placed here after blockchain compile:

```
src/abi/BondingCurveToken.json 
```

Copy it from blockchain project:

```bash
cp ../bonding-curve-blockchain/artifacts/contracts/BondingCurveToken.sol/BondingCurveToken.json src/abi.json
```
```

