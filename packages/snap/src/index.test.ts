import { SnapConfirmationInterface, installSnap } from '@metamask/snaps-jest';
import { expect } from '@jest/globals';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { assert } from '@metamask/snaps-sdk';

describe('onRpcRequest', () => {
  it('Get public address', async () => {
    const { request, close } = await installSnap();
    const response = await request({
      method: 'mvx_getAddress',
    });

    expect(response).toRespondWith(
      'erd184gtfgrrdmfc0qwq93g804w2z4rat453334uelfn5jznameapw6s7kf0f4',
    );

    await close();
  });

  it('Throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();
    const response = await request({
      method: 'wrong_method',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });

    await close();
  });

  it('User agrees to sign the message', async () => {
    const { request, close } = await installSnap();
    const userMessage = 'Jest unit test message !';
    const response = request({
      method: 'mvx_signMessage',
      params: {
        message: userMessage,
      },
    });

    const ui = await response.getInterface();

    expect(ui).toRender(
      panel([
        heading('Sign message'),
        divider(),
        text('Message : '),
        copyable(userMessage),
      ]),
    );

    expect(ui.type).toBe('confirmation');
    await ui.ok();

    expect(await response).toRespondWith(
      'f017d929054153b165c4f591b64260f990d5836c9f0f5045d88eeeacd5263ec2a459723e826a5a2633a4a57f7d1e5892da22e7b49b6d6fb72455872e2af87e06',
    );

    await close();
  });

  it('User refuses to sign the message', async () => {
    const { request, close } = await installSnap();
    const userMessage = 'Jest unit test message !';
    const response = request({
      method: 'mvx_signMessage',
      params: {
        message: userMessage,
      },
    });

    const ui = (await response.getInterface()) as SnapConfirmationInterface;

    expect(ui).toRender(
      panel([
        heading('Sign message'),
        divider(),
        text('Message : '),
        copyable(userMessage),
      ]),
    );

    expect(ui.type).toBe('confirmation');
    await ui.cancel();

    expect(await response).toRespondWithError({
      code: -32603,
      message: 'Message must be signed by the user',
      stack: expect.any(String),
    });

    await close();
  });

  it('User agrees to sign the auth token', async () => {
    const { request, close } = await installSnap();
    const authToken =
      'aHR0cHM6Ly9teC10ZW1wbGF0ZS1kYXBwLnZlcmNlbC5hcHA.f587f5591b3c69848bee85aa8225d0030c3c3d77810b8bbebd48dbe55b24e819.86400.eyJ0aW1lc3RhbXAiOjE3MDQ1NDAzMjB9';
    const response = request({
      method: 'mvx_signAuthToken',
      params: {
        token: authToken,
      },
    });

    const ui = await response.getInterface();

    expect(ui).toRender(
      panel([
        heading('Confirm the Auth Token :'),
        divider(),
        copyable(authToken),
      ]),
    );

    expect(ui.type).toBe('confirmation');
    await ui.ok();

    expect(await response).toRespondWith(
      '60060590b2d40bea92d9b3aae9a90301d006b037506b604e89240c0444dbdc7b9ebc1c45af3ef5a872ae7fd039738aec407b1441a1926394066c6bcfdba31d00',
    );

    await close();
  });

  it('User refuses to sign the auth token', async () => {
    const { request, close } = await installSnap();
    const authToken =
      'aHR0cHM6Ly9teC10ZW1wbGF0ZS1kYXBwLnZlcmNlbC5hcHA.f587f5591b3c69848bee85aa8225d0030c3c3d77810b8bbebd48dbe55b24e819.86400.eyJ0aW1lc3RhbXAiOjE3MDQ1NDAzMjB9';
    const response = request({
      method: 'mvx_signAuthToken',
      params: {
        token: authToken,
      },
    });

    const ui = (await response.getInterface()) as SnapConfirmationInterface;

    expect(ui).toRender(
      panel([
        heading('Confirm the Auth Token :'),
        divider(),
        copyable(authToken),
      ]),
    );

    expect(ui.type).toBe('confirmation');
    await ui.cancel();

    expect(await response).toRespondWithError({
      code: -32603,
      message: 'Token must be signed by the user',
      stack: expect.any(String),
    });

    await close();
  });

  it('User agrees to sign a single transaction', async () => {
    const { request, close } = await installSnap();

    const transactions = [
      {
        nonce: 1,
        value: '1',
        receiver:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        sender:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        gasPrice: 120000,
        gasLimit: 120000,
        chainID: 'D',
        version: 1,
      },
    ];

    const response = request({
      method: 'mvx_signTransactions',
      params: {
        transactions: transactions,
      },
    });

    const ui = await response.getInterface();

    expect(ui).toRender(
      panel([
        heading('Confirm transaction'),
        divider(),
        text('Send the following amount : '),
        copyable('0.000000000000000001 EGLD'),
        text('To the following address:'),
        copyable(
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        ),
        text('data:'),
        copyable(''),
      ]),
    );

    assert(ui.type == 'confirmation');
    await ui.ok();

    expect(await response).toRespondWith([
      '{"nonce":1,"value":"1","receiver":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","sender":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","gasPrice":120000,"gasLimit":120000,"chainID":"D","version":1,"signature":"1e560e0a8d7b5251ed98ab67016f8513d5631a93e2a1273211acab47d18a48780b9b2f51dab53ddba1df6c311afb64845940a7c40d8e732af464ebf27a3a1b04"}',
    ]);

    await close();
  });

  it('User sign a transaction and refuse the other one', async () => {
    const { request, close } = await installSnap();

    const transactions = [
      {
        nonce: 1,
        value: '1',
        receiver:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        sender:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        gasPrice: 120000,
        gasLimit: 120000,
        chainID: 'D',
        version: 1,
      },
      {
        nonce: 2,
        value: '2',
        receiver:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        sender:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        gasPrice: 120000,
        gasLimit: 120000,
        chainID: 'D',
        version: 1,
      },
    ];

    const response = request({
      method: 'mvx_signTransactions',
      params: {
        transactions: transactions,
      },
    });

    const ui = await response.getInterface();

    expect(ui).toRender(
      panel([
        heading('Confirm transaction'),
        divider(),
        text('Send the following amount : '),
        copyable('0.000000000000000001 EGLD'),
        text('To the following address:'),
        copyable(
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        ),
        text('data:'),
        copyable(''),
      ]),
    );

    assert(ui.type == 'confirmation');
    await ui.ok();

    const ui2 = await response.getInterface();

    expect(ui2).toRender(
      panel([
        heading('Confirm transaction'),
        divider(),
        text('Send the following amount : '),
        copyable('0.000000000000000002 EGLD'),
        text('To the following address:'),
        copyable(
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        ),
        text('data:'),
        copyable(''),
      ]),
    );

    assert(ui2.type == 'confirmation');
    await ui2.cancel();

    expect(await response).toRespondWithError({
      code: -32603,
      message: 'All transactions must be approved by the user',
      stack: expect.any(String),
    });

    await close();
  });

  it('User sign all transactions', async () => {
    const { request, close } = await installSnap();

    const transactions = [
      {
        nonce: 1,
        value: '1',
        receiver:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        sender:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        gasPrice: 120000,
        gasLimit: 120000,
        chainID: 'D',
        version: 1,
      },
      {
        nonce: 2,
        value: '2',
        receiver:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        sender:
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        gasPrice: 120000,
        gasLimit: 120000,
        chainID: 'D',
        version: 1,
      },
    ];

    const response = request({
      method: 'mvx_signTransactions',
      params: {
        transactions: transactions,
      },
    });

    const ui = await response.getInterface();

    expect(ui).toRender(
      panel([
        heading('Confirm transaction'),
        divider(),
        text('Send the following amount : '),
        copyable('0.000000000000000001 EGLD'),
        text('To the following address:'),
        copyable(
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        ),
        text('data:'),
        copyable(''),
      ]),
    );

    assert(ui.type == 'confirmation');
    await ui.ok();

    const ui2 = await response.getInterface();

    expect(ui2).toRender(
      panel([
        heading('Confirm transaction'),
        divider(),
        text('Send the following amount : '),
        copyable('0.000000000000000002 EGLD'),
        text('To the following address:'),
        copyable(
          'erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh',
        ),
        text('data:'),
        copyable(''),
      ]),
    );

    assert(ui2.type == 'confirmation');
    await ui2.ok();

    expect(await response).toRespondWith([
      '{"nonce":1,"value":"1","receiver":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","sender":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","gasPrice":120000,"gasLimit":120000,"chainID":"D","version":1,"signature":"1e560e0a8d7b5251ed98ab67016f8513d5631a93e2a1273211acab47d18a48780b9b2f51dab53ddba1df6c311afb64845940a7c40d8e732af464ebf27a3a1b04"}',
      '{"nonce":2,"value":"2","receiver":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","sender":"erd1elfck5guq2akmdee9p6lwv6wa8cuf250fajmff99kpu3vhgcnjlqs8radh","gasPrice":120000,"gasLimit":120000,"chainID":"D","version":1,"signature":"0a6304b7ffd8abde379432572567b9203e150482e028c7b568ab8b0cb603ba136f4a8bb6ba69ed5386c423fd77915fbfbd81e462bfb918c9808fa83b399a820d"}',
    ]);

    await close();
  });
});
