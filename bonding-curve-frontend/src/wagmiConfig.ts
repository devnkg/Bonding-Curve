import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia], // यहाँ अपनी chain रखो (mainnet, polygon, arbitrum etc.)
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [injected()],
});
