import { Json, OnRpcRequestHandler } from '@metamask/snaps-types';
import { getAddress, getBalance, makeTransaction } from './rpc';
import { ApiParams, SnapRequestParams } from './types/snapParam';
import { SnapState } from './types/snapState';

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
  const snapParams = request?.params as unknown as SnapRequestParams;

  let state = await GetSnapState();

  const apiParams: ApiParams = {
    state,
    snapParams
  };

  switch (request.method) {
    case 'mvx_getAddress':
      return getAddress();
    case 'mvx_getBalance':
      return getBalance(apiParams);
    case 'mvx_makeTransaction':
      return makeTransaction(apiParams);
    default:
      throw new Error('Method not found.');
  }
};


async function GetSnapState() {
  let state = snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  }) as unknown as SnapState;

  //Create the state if not exist
  if (!state) {
    state = {
      address: await getAddress(),
    };
    
    CreateSnapState(state);
  }

  return state;
}

function CreateSnapState(state: SnapState) {
  snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: state as unknown as Record<string, Json>,
    },
  });
}