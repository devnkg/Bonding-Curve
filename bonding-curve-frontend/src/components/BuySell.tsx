import { useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../Contract";

// Read example
export function usePreviewBuy(amountEth: bigint) {
  return useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "previewBuy",
    args: [amountEth],
  });
}

// Write example
export function useBuyTokens() {
  return useWriteContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "buy",
  });
}
