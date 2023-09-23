import { useContext } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { useAddress } from '../hooks/useAddress';
import { useBalance } from '../hooks/useBalance';
import { useSendTransaction } from '../hooks/useSendTransaction';
import { getNetwork } from '../utils/network';
import { getAmountPrice } from '../utils/formatter';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const {
    error: txError,
    isLoading: isTxLoading,
    lastTxId,
    sendTransaction,
  } = useSendTransaction();

  const handleSendTransaction: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    sendTransaction(formData);
  };

  const isSnapInstalled = Boolean(state.installedSnap);
  const { address } = useAddress(isSnapInstalled);
  const { balance } = useBalance(isSnapInstalled);
  const network = getNetwork();

  return (
    <Container>
      <Heading>
        Welcome to <Span>mvx-snap</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {address && (
          <Card
            fullWidth
            content={{
              title: `Your Mvx ${network.name} Address`,
              description: address,
            }}
          />
        )}
        {isSnapInstalled && (
          <Card
            fullWidth
            content={{
              title: 'Send ' + network.egldLabel,
              description: (
                <>
                  <form onSubmit={handleSendTransaction}>
                    <p>
                      <input
                        type="text"
                        name="toAddress"
                        placeholder="Address"
                      />
                    </p>
                    <p>
                      <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        step="any"
                      />
                    </p>
                    <button disabled={isTxLoading} type="submit">
                      Send {network.egldLabel}
                    </button>
                  </form>
                  {lastTxId && (
                    <p>
                      Latest transaction:{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${network.explorerAddress}/transactions/${lastTxId}`}
                      >
                        {lastTxId}
                      </a>
                    </p>
                  )}
                  {txError && <ErrorMessage>{txError}</ErrorMessage>}
                </>
              ),
            }}
          />
        )}
        {balance !== undefined && (
          <Card
            fullWidth
            content={{
              title: `Your Mvx ${network.name} Balance`,
              description: `${getAmountPrice(balance) } ${network.egldLabel}`,
            }}
          />
        )}
      </CardContainer>
    </Container>
  );
};

export default Index;
