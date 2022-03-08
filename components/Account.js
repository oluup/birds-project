import React, { Component } from "react";
import Styled from "styled-components";
import Oluup from "oluup";
import _ from "lodash";
import getConfig from "next/config";
import Web3 from "web3";

// Components
import Loading from "./Loadings";

const Wrapper = Styled.div`

`;

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

const ConnectButtonLink = Styled.a`
  display: inline-block!important;
  border: 5px solid #1fc7d4;
  font-size: 20px;
  padding: 0 20px;
  background-color: #ed4a9e;
  color: white!!important;
  border-radius: 5px;
  text-decoration: none;

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

const OluupButton = Styled(ConnectButtonLink)`
  background-color: black;
  border-color: black;
  font-size: 30px;

  margin-top: 10px;
`;

const DetailContent = Styled.div`
    width: 300px;
    background: #f1ce10;
    border-radius: 10px;
    padding: 20px 0;
    margin: 20px auto;

    img {
      width: 250px;
      height: 250px;
      border-radius: 5px;
    }

    ul {
      padding: 0px;
      margin: 0px;
      list-style: none;
    }

    p {
      font-size: 30px;
    }

    a {
      display: block;
      margin-top: 10px;
      color: #0a95ff;

      &:hover {
        font-weight: bold;
      }
    }
`;

const TotalMintedText = Styled.span`
    font-size: 30px;
    color: #005670;
    text-decoration: underline;
    margin-bottom: 20px;
    display: block;
`;

const { publicRuntimeConfig } = getConfig();

export default class Account extends Component {
  state = {
    isLoading: true,
    detail: null,

    transactionHash: null,
    step: "CONNECTING OLUUP",
    tokenId: null,
    total: 0,
  };

  async componentDidMount() {
    const { wallet } = this.props;

    this.OluupNode = new Oluup(wallet.ethereum);

    this.contract = await this.OluupNode.contract(
      "Single",
      publicRuntimeConfig.COLLECTION_ADDRESS
    );

    const total = await this.contract.totalSupply();

    this.setState({
      isLoading: false,
      step: null,
      total,
    });
  }

  async mint() {
    const { wallet } = this.props;

    // XXX: your Project Api random
    const BIRD_INDEX = _.random(0, 999);
    const image_url = `/static/images/birds/${BIRD_INDEX}.png`;

    this.setState({
      isLoading: true,
      step: "GET_IMAGE",
    });

    // 1 -- GET IMAGE
    return fetch(image_url)
      .then((r) => r.blob())
      .then(async (image) => {
        const name = `Bird #${BIRD_INDEX}`;
        const attributes = [
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
        ];

        this.setState({
          detail: {
            name,
            image_url,
            attributes,
          },
        });

        this.setState({
          step: "UPLOAD_IPFS",
        });

        // 2 - CREATE IPFS METADATA FILE
        const tokenURI = await this.OluupNode.ipfs({
          name,
          description: "A beautiful bird is not the same as everyone else.",
          image,

          attributes,
        });

        this.setState({
          step: "CONFIRM_NFT",
        });

        // [ [<tokenURI>, <MINT_PRICE>, <ROYALITY>] ]
        const items = [[tokenURI, publicRuntimeConfig.MINT_PRICE, 0]];

        // 3 -- MINT NFT
        this.contract
          .preSaleMint(items, wallet.account)
          .on("confirmation", this.onConfirmation.bind(this))
          .on("error", this.onError.bind(this));
      });
  }

  onConfirmation(confirmationNumber, receipt) {
    this.setState({
      step: `${confirmationNumber} BLOCK CONFIRMATION`,
      confirmationNumber,
    });

    if (confirmationNumber == 15) {
      const { returnValues } = receipt.events.Minted;

      this.setState({
        isLoading: false,
        transactionHash: receipt.transactionHash,
        step: null,
        tokenId: returnValues._tokenId,
      });
    }
  }

  onError() {
    this.setState({
      isLoading: false,
      detail: null,
      confirmationNumber: 0,
      step: null,
    });
  }

  render() {
    const { wallet } = this.props;
    const { detail, isLoading, transactionHash, step, tokenId, total } =
      this.state;

    return (
      <Wrapper>
        {!!total && (
          <TotalMintedText>Total minted ducks ({total})</TotalMintedText>
        )}

        <div>Account: {wallet.account}</div>

        {isLoading ? (
          <Loading step={step} />
        ) : (
          <>
            <ConnectButton onClick={() => wallet.reset()} disabled={isLoading}>
              Disconnect
            </ConnectButton>

            <div className="mt-5">
              <MintButton onClick={() => this.mint()} disabled={isLoading}>
                MINT with <span>({Web3.utils.fromWei(publicRuntimeConfig.MINT_PRICE)} BNB)</span>
              </MintButton>
            </div>
          </>
        )}

        {!!transactionHash && (
          <DetailContent>
            <img src={detail.image_url} />

            <p>{detail.name}</p>

            <ul>
              {detail.attributes.map(({ trait_type, value }, i) => {
                return (
                  <li key={i}>
                    {trait_type}:{value}
                  </li>
                );
              })}
            </ul>

            <OluupButton
              href={`https://testnet.oluup.com/assets/${publicRuntimeConfig.COLLECTION_ADDRESS}-${tokenId}?status=CREATED`}
              target="_blank"
            >
              View With Oluup
            </OluupButton>

            <a
              href={`https://testnet.bscscan.com/tx/${transactionHash}`}
              target="_blank"
            >
              View Transaction Details
            </a>
          </DetailContent>
        )}
      </Wrapper>
    );
  }
}
