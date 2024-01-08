import { NetworkType } from './types/networkType';

export const DECIMALS = 18;
export const DIGITS = 2;

export const networks: NetworkType[] = [
  {
    id: 'testnet',
    name: 'Testnet',
    chainId: 'T',
    egldLabel: 'xEGLD',
    apiAddress: 'https://testnet-api.multiversx.com',
  },
  {
    id: 'devnet',
    name: 'Devnet',
    chainId: 'D',
    egldLabel: 'xEGLD',
    apiAddress: 'https://devnet-api.multiversx.com',
  },
  {
    id: 'mainnet',
    name: 'Mainnet',
    chainId: '1',
    egldLabel: 'EGLD',
    apiAddress: 'https://api.multiversx.com',
  },
];
