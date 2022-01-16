import React from "react";
import { useWallet } from "use-wallet";
import Styled from "styled-components";
import Oluup from "oluup";
import _ from "lodash";

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

const MintButton = Styled(ConnectButton)`
  background-color: #6434c9;
  border-color: #ff7efb;
  font-size: 30px;

  span {
    color: #cbff00;
  }
`;

const WalletContent = Styled.div`
  text-align: center;
`;

const BIT_BIRDS_ADDRESS = "0x4cc04F9Bd875212F3887dDE31acEe04984f3B730";
const MINT_AMOUNT = "0.03";

const Wallet = () => {
  const wallet = useWallet();

  const mint = async () => {
    const OluupNode = new Oluup(wallet.ethereum);
    const contract = await OluupNode.contract("Single", BIT_BIRDS_ADDRESS);

    const BIRD_INDEX = _.random(0, 999);

    return fetch(`/static/images/birds/${BIRD_INDEX}.png`)
      .then((r) => r.blob())
      .then(async (image) => {

        // ipfs upload
        const tokenURI = await OluupNode.ipfs({
          name: `Bird #${BIRD_INDEX}`,
          description: "A beautiful bird is not the same as everyone else.",
          image,

          attributes: [
            {
              trait_type: "Speed",
              value: _.random(0, 100),
            },

            {
              trait_type: "Wing",
              value: _.random(0, 100),
            },

            {
              trait_type: "Max Flying",
              value: _.random(0, 100),
            },
          ],
        });

        console.log(tokenURI);

        contract.mint({
          tokenURI,
          from: wallet.account,
          buyAmount: MINT_AMOUNT,
          mintAmount: MINT_AMOUNT,
        });
      });
  };

  return (
    <WalletContent>
      {wallet.status === "connected" ? (
        <>
          <div>Account: {wallet.account}</div>
          <ConnectButton onClick={() => wallet.reset()}>
            Disconnect
          </ConnectButton>

          <div className="mt-5">
            <MintButton onClick={() => mint()}>
              MINT with <span>(0.03 bnb)</span>
            </MintButton>
          </div>
        </>
      ) : (
        <ConnectButton onClick={() => wallet.connect()}>
          Connect Wallet
        </ConnectButton>
      )}
    </WalletContent>
  );
};

export default Wallet;
