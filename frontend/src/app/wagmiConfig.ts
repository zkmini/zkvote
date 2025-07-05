import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet], // You can add testnets or your custom chain here
  connectors: [
    injected(), // MetaMask and other browser wallets
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
