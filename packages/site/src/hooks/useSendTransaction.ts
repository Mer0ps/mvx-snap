import { useState } from 'react';
import { getAddressSnap, makeTransactionSnap } from '../utils';
import { Address, TokenTransfer, Transaction } from '@multiversx/sdk-core/out';
import { getNetwork } from '../utils/network';

export const useSendTransaction = () => {
  const [lastTxId, setLastTxId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sendTransaction = async (data: FormData) => {
    if (isLoading) {
      return;
    }

    try {
      setError(undefined);
      setLastTxId(undefined);
      setIsLoading(true);
      const toAddress = data.get('toAddress');
      const amount = data.get('amount');

      if (typeof toAddress === 'string' && typeof amount === 'string') {
        
        const fromAddress = await getAddressSnap() as string;
        const network = getNetwork();

        const transaction = new Transaction({
            value: TokenTransfer.egldFromAmount(amount),
            receiver: Address.fromBech32(toAddress),
            sender: Address.fromBech32(fromAddress),
            gasPrice: 1000000000,
            gasLimit: 70000,
            chainID: network.chainId,
            version: 1,
          });

        const response = await makeTransactionSnap(transaction);
        const trans = Transaction.fromPlainObject(JSON.parse(response));
        
        //TODO send the transaction with the provider
        setLastTxId(trans.getHash().hex());
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError(`An unknown error occurred: ${JSON.stringify(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { lastTxId, isLoading, error, sendTransaction };
};
