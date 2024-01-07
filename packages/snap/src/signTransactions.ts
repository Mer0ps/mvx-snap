import { SignTransactionsParams } from './types/snapParam';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { TokenTransfer, Transaction } from '@multiversx/sdk-core/out';
import { getWalletKeys } from './private-key';
import { denominate } from './denominate';
import BigNumber from 'bignumber.js';
import { DECIMALS, DIGITS, TICKER } from './constants';

/**
 * @param params - The transaction(s) to sign.
 */
export const signTransactions = async (
  transactionsParam: SignTransactionsParams,
): Promise<string[]> => {
  const { userSecret } = await getWalletKeys();

  const transactionsSigned: string[] = [];
  for (const transactionPlain of transactionsParam.transactions) {
    const transaction = Transaction.fromPlainObject(transactionPlain);

    const txValue = formatEGLD(transaction.getValue().toString());
    const txFees = calculateFees(transaction);

    const confirmationResponse = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          text('Send to'),
          text(transaction.getReceiver().bech32()),
          divider(),
          text('Amount'),
          text(txValue),
          divider(),
          text('Fee'),
          text(txFees),
          divider(),
          text('Data'),
          copyable(transaction.getData().toString()),
        ]),
      },
    });

    if (confirmationResponse !== true) {
      throw new Error('All transactions must be approved by the user');
    }

    const serializedTransaction = transaction.serializeForSigning();
    const transactionSignature = userSecret.sign(serializedTransaction);
    transaction.applySignature(transactionSignature);

    transactionsSigned.push(JSON.stringify(transaction.toPlainObject()));
  }

  return transactionsSigned;

  function calculateFees(transaction: Transaction) {
    const bNgasPrice = new BigNumber(transaction.getGasPrice().valueOf());
    const bNgasUsed = new BigNumber(transaction.getGasLimit().valueOf());
    const fees = bNgasPrice.times(bNgasUsed).toString();

    return formatEGLD(fees);
  }

  function formatEGLD(input: string) {
    return denominate({
      input: input,
      denomination: DECIMALS,
      decimals: DIGITS,
      ticker: TICKER,
    });
  }
};
