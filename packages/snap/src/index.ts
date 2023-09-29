import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getAddress, signMessage, signTransactions } from './rpc';
import { SignMessageParams, SignTransactionsParams } from './types/snapParam';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {

  switch (request.method) {
    case 'mvx_getAddress':
      return getAddress();
    case 'mvx_signTransactions':
      const signTransactionParam = request?.params as unknown as SignTransactionsParams;
        return signTransactions(signTransactionParam);
    case 'mvx_signMessage':
      const snapParams = request?.params as unknown as SignMessageParams;
      return signMessage(snapParams);
    default:
      throw new Error('Method not found.');
  }
};