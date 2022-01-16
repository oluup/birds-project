import React from "react";
import { useWallet } from "use-wallet";
import Styled from 'styled-components';

const ConnectButton = Styled.button`
  border: 5px solid #1fc7d4;
  font-size: 30px;
  padding: 0 20px;
  background-color: #ed4a9e;
  color: white;
`;

const WalletContent = Styled.div`
  text-align: center;
`;

const Wallet = () => {
  const wallet = useWallet();

  return (
    <WalletContent>
      {wallet.status === "connected" ? (
        <>
          <div>Account: {wallet.account}</div>
          <ConnectButton onClick={() => wallet.reset()}>Disconnect</ConnectButton>
        </>
      ) : (
        <ConnectButton onClick={() => wallet.connect()}>Connect Wallet</ConnectButton>
      )}
    </WalletContent>
  );
};

export default Wallet;
