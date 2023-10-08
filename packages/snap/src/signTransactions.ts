import { SignTransactionsParams } from "./types/snapParam";
import { copyable, divider, heading, panel, text } from "@metamask/snaps-ui";
import { TokenTransfer, Transaction } from "@multiversx/sdk-core/out";
import { getWalletKeys } from "./snapUtils";

/**
 * @param params - The transaction(s) to sign.
 */
export const signTransactions = async (transactionsParam: SignTransactionsParams): Promise<string[]> => {

    const { userSecret } = await getWalletKeys();
  
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