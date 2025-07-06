import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet], // You can add testnets or your custom chain here
  connectors: [
    metaMask(), // Only MetaMask
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
