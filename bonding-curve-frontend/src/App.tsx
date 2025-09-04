import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../src/utils/contract";

type TxStatus = "idle" | "pending" | "success" | "error";

function App() {
  const [account, setAccount] = useState<string>();
  const [contract, setContract] = useState<any>();
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [price, setPrice] = useState<string>("0");
  const [supply, setSupply] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [circulating, setCirculating] = useState<string>("0");

  const [ethInput, setEthInput] = useState<string>("");
  const [estTokens, setEstTokens] = useState<string>("0");

  const [tokenInput, setTokenInput] = useState<string>("");
  const [estEth, setEstEth] = useState<string>("0");

  const [txHash, setTxHash] = useState<string>("");
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");

  // connect wallet
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }
    const p = new ethers.BrowserProvider(window.ethereum);
    const accounts = await p.send("eth_requestAccounts", []);
    const signer = await p.getSigner();
    setProvider(p);
    setAccount(accounts[0]);
    setContract(getContract(signer));
  }

  // disconnect wallet
  function disconnectWallet() {
    setAccount(undefined);
    setContract(undefined);
    setProvider(undefined);
    setBalance("0");
    setSupply("0");
    setCirculating("0");
    setPrice("0");
  }

async function loadStats() {
  if (!contract || !account) return;
  try {
    const p = await contract.currentPrice();        
    const s = await contract.totalSupply();         
    const c = await contract.circulatingSupply(); 
    const b = await contract.balanceOf(account); 

    console.log("DEBUG price:", p.toString());
    console.log("DEBUG total supply:", s.toString());
    console.log("DEBUG circulating:", c.toString());
    console.log("DEBUG balance:", b.toString());

    setPrice(ethers.formatEther(p));      
    setSupply(s.toString());               
    setCirculating(c.toString());         
    setBalance(ethers.formatEther(b));     
  } catch (e) {
    console.error("Stats fetch error:", e);
  }
}


  // estimate buy
  async function previewBuy(value: string) {
    if (!contract || !value) return;
    const ethValue = ethers.parseEther(value);
    const est = await contract.previewBuy(ethValue);
    setEstTokens(ethers.formatEther(est));
  }

  // estimate sell
  async function previewSell(value: string) {
    if (!contract || !value) return;
    const tokenValue = ethers.parseEther(value);
    const est = await contract.previewSell(tokenValue);
    setEstEth(ethers.formatEther(est));
  }

  // inside buyTokens()
  async function buyTokens() {
    if (!contract || !ethInput) return;
    try {
      setTxStatus("pending");
      const ethValue = ethers.parseEther(ethInput);
      const est = await contract.previewBuy(ethValue);

      const tx = await contract.buy(est * 99n / 100n, { value: ethValue });
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      if (receipt.status === 1n) {
        setTxStatus("success");
        await loadStats();
      } else {
        setTxStatus("error");
      }
    } catch (e) {
      console.error("Buy error:", e);
      setTxStatus("error");
    }
  }

  // inside sellTokens()
  async function sellTokens() {
    if (!contract || !tokenInput) return;
    try {
      setTxStatus("pending");
      const tokenValue = ethers.parseEther(tokenInput);
      const est = await contract.previewSell(tokenValue);

      const tx = await contract.sell(tokenValue, est * 99n / 100n);
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      if (receipt.status === 1n) {
        setTxStatus("success");
        await loadStats();
      } else {
        setTxStatus("error");
      }
    } catch (e) {
      console.error("Sell error:", e);
      setTxStatus("error");
    }
  }


  useEffect(() => {
    if (contract && account) loadStats();
  }, [contract, account]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Bonding Curve Token</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      )}

      <h3>Stats</h3>
      <p>Current Price: {price} ETH</p>
      <p>Total Supply: {supply}</p>
      <p>Circulating Supply: {circulating}</p>
      <p>Your Balance: {balance} Tokens</p>

      <h3>Buy Tokens</h3>
      <input
        type="text"
        placeholder="ETH amount"
        value={ethInput}
        onChange={(e) => {
          setEthInput(e.target.value);
          previewBuy(e.target.value);
        }}
      />
      <p>Estimated Tokens: {estTokens}</p>
      <button onClick={buyTokens}>Buy</button>

      <h3>Sell Tokens</h3>
      <input
        type="text"
        placeholder="Token amount"
        value={tokenInput}
        onChange={(e) => {
          setTokenInput(e.target.value);
          previewSell(e.target.value);
        }}
      />
      <p>Estimated ETH: {estEth}</p>
      <button onClick={sellTokens}>Sell</button>

      {txHash && (
        <p>
          Last Tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">{txHash}</a>
        </p>
      )}
    </div>
  );
}

export default App;
