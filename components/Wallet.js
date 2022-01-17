import React from "react";
import { useWallet } from "use-wallet";
import Styled from "styled-components";
import _ from "lodash";

// Components
import Account from "./Account";

const ConnectButton = Styled.button`
  border: 5px solid #1fc7d4;
  font-size: 20px;
  padding: 0 20px;
  background-color: #ed4a9e;
  color: white;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const WalletContent = Styled.div`
  text-align: center;
`;

const Wallet = () => {
  const wallet = useWallet();

  return (
    <WalletContent>
      {wallet.status === "connected" ? (
        <Account wallet={wallet} />
      ) : (
        <ConnectButton onClick={() => wallet.connect()}>
          Connect Wallet
        </ConnectButton>
      )}
    </WalletContent>
  );
};

export default Wallet;
