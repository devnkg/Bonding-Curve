import { ethers } from "ethers";
import abi from "../abi/BondingCurveToken.json";

export const CONTRACT_ADDRESS = "0x17782F1E07980E39f3B49A1F645597DdaA95d945";

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signerOrProvider);
}
