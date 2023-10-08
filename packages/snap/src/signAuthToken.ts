import { Address, SignableMessage } from '@multiversx/sdk-core';
import { copyable, divider, heading, panel } from '@metamask/snaps-ui';
import { getWalletKeys } from './snapUtils';
import { SignAuthTokenParams } from './types/snapParam';


/**
 * @param tokenParam - The token to sign.
 */
export const signAuthToken = async (tokenParam: SignAuthTokenParams): Promise<string> => {

  const { userSecret, publicKey } = await getWalletKeys();
 
  const confirmationResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Confirm the Auth Token :'),
        divider(),
        copyable(tokenParam.token),
      ]),
    },
  });

  if (confirmationResponse !== true) {
    throw new Error('Token must be signed by the user');
  }

  const signableMessage = new SignableMessage({
      address: new Address(publicKey),
      message: Buffer.from(`${publicKey}${tokenParam.token}`, 'utf8'),
  });

  const cryptoMessage = Buffer.from(signableMessage.serializeForSigning().toString('hex'), "hex");

  return userSecret.sign(cryptoMessage).toString("hex");
};