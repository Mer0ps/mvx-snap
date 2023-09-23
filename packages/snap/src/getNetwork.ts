import { Network } from "./types/network";
import { chainIdToEnvironment } from "./utils/constants";

export const getNetworkByChainId = async (chainID : string): Promise<Network> => {
    return chainIdToEnvironment[chainID];
};