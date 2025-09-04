import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// wagmi client config
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), // Metamask / Brave / etc
  ],
  transports: {
    [sepolia.id]: http(), // default RPC
  },
})
