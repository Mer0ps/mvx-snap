import { getAccount } from './private-key';
import { UserSecretKey } from '@multiversx/sdk-wallet';
import { IPlainTransactionObject, SignableMessage, TokenTransfer, Transaction } from '@multiversx/sdk-core';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { SignMessageParams, SignTransactionsParams } from './types/snapParam';

/**
 * This wallet uses a single account/address.
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

/**
 * @param params - The transaction(s) to sign.
 */
export const signTransactions = async (transactionsParam: SignTransactionsParams): Promise<string[]> => {

  const account = await getAccount();

  if (!account.privateKeyBytes) {
    throw new Error('Private key is required');
  }

  const userSecret = new UserSecretKey((account.privateKeyBytes as Uint8Array));

  const transactionsSigned: string[] = [];
  for (const transactionPlain of transactionsParam.transactions) {

    const transaction = Transaction.fromPlainObject(transactionPlain);
    const amount = TokenTransfer.egldFromBigInteger(transaction.getValue().toString());

    const confirmationResponse = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading('Confirm transaction'),
          divider(),
          text('Send the following amount : '),
          copyable(amount.toPrettyString()),
          text('To the following address:'),
          copyable(transaction.getReceiver().bech32()),
          text('data:'),
          copyable(transaction.getData().toString()),
        ]),
      },
    });

    if (confirmationResponse !== true) {
      throw new Error('Transaction must be approved by the user');
    }

    const serializedTransaction = transaction.serializeForSigning();
    const transactionSignature = userSecret.sign(serializedTransaction);
    transaction.applySignature(transactionSignature);

    transactionsSigned.push(JSON.stringify(transaction.toPlainObject()));
  };

  return transactionsSigned;
};


/**
 * @param messageParam - The message to sign.
 */
export const signMessage = async (messageParam: SignMessageParams): Promise<string> => {

  const signableMessage = new SignableMessage({ message : Buffer.from(messageParam.message, 'ascii') });
  
  const confirmationResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign message'),
        divider(),
        text('Message : '),
        copyable(messageParam.message),
      ]),
    },
  });

  if (confirmationResponse !== true) {
    throw new Error('Message must be signed by the user');
  }

  const account = await getAccount();

  if (!account.privateKeyBytes) {
    throw new Error('Private key is required');
  }

  const userSecret = new UserSecretKey((account.privateKeyBytes as Uint8Array));
  
  const serializedMessage = signableMessage.serializeForSigning();
  const signedMessage = userSecret.sign(serializedMessage);

  return signedMessage.toString('hex');
};



