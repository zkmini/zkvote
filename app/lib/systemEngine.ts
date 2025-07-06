import { BrowserProvider, Contract, Signer } from 'ethers';
import { abi } from '../abi/SystemEngine';

export const SYSTEM_ENGINE_ADDRESS = '0xC8C3c2498AdC1809f577C58cA2A5CF2DdC666262';

let provider: BrowserProvider | null = null;
let signer: Signer | null = null;
let contract: Contract | null = null;

/**
 * Ensure we have a connected signer + contract (lazily initialised).
 * Calling this will trigger a wallet connection prompt if not yet connected.
 */
export async function getSystemEngine(): Promise<Contract> {
  if (contract) return contract;
  if (!(window as any).ethereum) throw new Error('Ethereum wallet not found');

  provider = new BrowserProvider((window as any).ethereum);
  await provider.send('eth_requestAccounts', []);
  signer = await provider.getSigner();
  contract = new Contract(SYSTEM_ENGINE_ADDRESS, abi, signer);
  return contract;
}

export function getSystemEngineContract(): Contract | null {
  return contract;
}

export function getSystemEngineSigner(): Signer | null {
  return signer;
}
