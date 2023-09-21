import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';

/**
 * The path of the account is m/44'/508'/0'/0/0.
 */
export const getAccount = async (): Promise<BIP44Node> => {
  const mvxNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 508, 
    },
  });

  const deriveMvxPrivateKey = await getBIP44AddressKeyDeriver(
    mvxNode,
  );

  return deriveMvxPrivateKey(0);
};