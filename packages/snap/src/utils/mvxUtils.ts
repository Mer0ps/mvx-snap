import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { AxiosRequestConfig  } from 'axios';
import { chainIdToEnvironment } from "./constants";
import { Network } from "../types/network";

export const getNetwork = (chainId: string | undefined): Network => {

    if(chainId === undefined){
        throw new Error('chainId cannot be undefined');
    }
    return chainIdToEnvironment[chainId];
};

export const getApiProvider = (chainId: string | undefined): ApiNetworkProvider => {

    if(chainId === undefined){
        throw new Error('chainId cannot be undefined');
    }
    
    const config: AxiosRequestConfig = {
        adapter: fetchAdapter
    };

    const network = chainIdToEnvironment[chainId];

    return new ApiNetworkProvider(network.baseUrl, config);
};