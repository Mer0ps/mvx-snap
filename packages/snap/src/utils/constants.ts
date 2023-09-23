import { Network } from "../types/network";

export const MAINNET_CHAIN_ID = '1';
export const DEVNET_CHAIN_ID = 'D';
export const TESTNET_CHAIN_ID = 'T';

export const MVX_MAINNET_NETWORK: Network = {
    name: 'MultiversX Mainnet',
    chainId: MAINNET_CHAIN_ID,
    baseUrl: 'https://api.multiversx.com',
    symbol: 'xEGLD'
};

export const MVX_TESTNET_NETWORK: Network = {
    name: 'MultiversX Testnet',
    chainId: TESTNET_CHAIN_ID,
    baseUrl: 'https://testnet-api.multiversx.com',
    symbol: 'xEGLD'
};

export const MVX_DEVNET_NETWORK: Network = {
    name: 'MultiversX Devnet',
    chainId: DEVNET_CHAIN_ID,
    baseUrl: 'https://devnet2-api.multiversx.com',
    symbol: 'EGLD'
};

export const chainIdToEnvironment: Record<string, Network> = {
    [DEVNET_CHAIN_ID]: MVX_DEVNET_NETWORK,
    [TESTNET_CHAIN_ID]: MVX_TESTNET_NETWORK,
    [MAINNET_CHAIN_ID]: MVX_MAINNET_NETWORK
  };
