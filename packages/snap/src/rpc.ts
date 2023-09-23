import { getAccount } from './private-key';
import { UserSecretKey } from '@multiversx/sdk-wallet';
import { Address, IPlainTransactionObject, TokenTransfer, Transaction } from '@multiversx/sdk-core';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { Json } from '@metamask/snaps-types';
import { getApiProvider, getNetwork } from './utils/mvxUtils';
import { ApiParams, GetBalanceParams, SendTransactionParams } from './types/snapParam';



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

export const getBalance = async (params : ApiParams): Promise<number> => {
    const { state, snapParams } = params;
    const snapParamsObj = snapParams as GetBalanceParams;
    const provider = getApiProvider(snapParamsObj.chainId);

    const account = await provider.getAccount(new Address(state.address));
    return (
      account.balance.toNumber()
    );
};

/**
 * @param transactionToSend - The transaction.
 */
export const makeTransaction = async (params: ApiParams): Promise<string> => {
    const { state, snapParams } = params;
    const snapParamsObj = snapParams as SendTransactionParams;

    const network = getNetwork(snapParamsObj.chainID);
    const provider = getApiProvider(network.chainId);
    const transaction = Transaction.fromPlainObject(snapParamsObj);

    const amount = TokenTransfer.egldFromBigInteger(transaction.getValue().toString());

    const confirmationResponse = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading('Confirm transaction on the '+ network.name),
          divider(),
          text('Send the following amount : '),
          copyable(amount.toPrettyString()),
          text('To the following address:'),
          copyable(transaction.getReceiver().bech32()),
        ]),
      },
    });
  
    if (confirmationResponse !== true) {
      throw new Error('Transaction must be approved by user');
    }
  
    const account = await getAccount();
  
    if (!account.privateKeyBytes) {
      throw new Error('Private key is required');
    }
  
    const accountOnNetwork = await provider.getAccount(new Address(state.address));
    transaction.setNonce(accountOnNetwork.nonce);

    const userSecret = new UserSecretKey((account.privateKeyBytes as Uint8Array));

    const serializedTransaction = transaction.serializeForSigning();
    const transactionSignature = userSecret.sign(serializedTransaction);
    transaction.applySignature(transactionSignature);

    const txResult = await provider.sendTransaction(transaction);

    return txResult;
};



