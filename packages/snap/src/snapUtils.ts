import { UserSecretKey } from "@multiversx/sdk-wallet/out";
import { getAccount } from "./private-key";

/**
 * Return the public and private keys of the account.
 */
export const getWalletKeys = async () => {
    const account = await getAccount();

    if(account.privateKeyBytes === undefined)
    {
        throw new Error('Address not found');
    }

    const userSecret = new UserSecretKey((account.privateKeyBytes as Uint8Array));

    return {
        privateKey: account.privateKeyBytes,
        publicKey: userSecret.generatePublicKey().toAddress().bech32(),
        userSecret : userSecret
    };
};