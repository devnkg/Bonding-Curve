import { getContract } from "wagmi/actions";
import { config } from "../wagmiConfig";
import abi from "../BondingCurveToken.json";

const CONTRACT_ADDRESS = "0x17782F1E07980E39f3B49A1F645597DdaA95d945";

export function useBondingCurve(signer?: any) {
  return getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    config,
  });
}
