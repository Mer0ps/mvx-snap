import { getAccount } from './private-key';
import { UserSecretKey } from '@multiversx/sdk-wallet';
import { Address } from '@multiversx/sdk-core';
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { AxiosRequestConfig  } from 'axios';

const config: AxiosRequestConfig = {
    adapter: fetchAdapter
};

const apiNetworkProvider = new ApiNetworkProvider("https://testnet-api.multiversx.com", config);

/**
 * This demo wallet uses a single account/address.
 */
export const getAddress = async (): Promise<string> => {
    const account = await getAccount();

    if(account.privateKeyBytes === undefined)
    {
        throw new Error('Address not found');
    }

    const userSecret = new UserSecretKey((account.privateKeyBytes as Uint8Array));
    
   
    return userSecret.generatePublicKey().toAddress().bech32();
};

export const getBalance = async (): Promise<number> => {
    const myAddress = await getAddress();

    const myAddressTyped = new Address(myAddress);
    const account = await apiNetworkProvider.getAccount(myAddressTyped);
    return (
      account.balance.toNumber()
    );
};