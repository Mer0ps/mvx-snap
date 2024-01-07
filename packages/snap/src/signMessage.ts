import { SignableMessage } from '@multiversx/sdk-core/out';
import { SignMessageParams } from './types/snapParam';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { getWalletKeys } from './private-key';

/**
 * @param messageParam - The message to sign.
 */
export const signMessage = async (
  messageParam: SignMessageParams,
): Promise<string> => {
  const { userSecret } = await getWalletKeys();

  const signableMessage = new SignableMessage({
    message: Buffer.from(messageParam.message, 'ascii'),
  });

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

  const serializedMessage = signableMessage.serializeForSigning();

  return userSecret.sign(serializedMessage).toString('hex');
};
