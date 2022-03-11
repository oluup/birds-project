import React, { Component } from "react";
import Styled from "styled-components";
import Oluup from "oluup";
import _ from "lodash";
import getConfig from "next/config";
import Web3 from "web3";
import InputNumber from "rc-input-number";

// Components
import Loading from "./Loadings";

const Wrapper = Styled.div`
  .rc-input-number {
    display: block;
    margin: auto;
    margin-bottom: 30px;
  }
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
    background: #f1ce10;
    border-radius: 10px;
    padding: 20px 0;
    margin: 20px auto;
    display: flex;
    
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

    .bird-item {
      margin: 0 5px;
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
    mintCount: 1,

    birds: [],
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

  randomBird() {
    const i = _.random(0, 999);

    return {
      name: `Bird #${i}`,
      image: `/static/images/birds/${i}.png`,
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
    };
  }

  async mint() {
    const { mintCount } = this.state;
    const { wallet } = this.props;
    const out = [];

    const birds = _.range(0, mintCount).map((i) => {
      const bird = this.randomBird();

      // push bird.
      out.push(bird);

      return new Promise((resolve) => {
        fetch(bird.image)
          .then((r) => r.blob())
          .then(async (image) => {
            // 2 - CREATE IPFS METADATA FILE
            const tokenURI = await this.OluupNode.ipfs({
              name: bird.name,
              description: "A beautiful bird is not the same as everyone else.",
              image,

              attributes: bird.attributes,
            });

            resolve(tokenURI);
          });
      });
    });

    this.setState({
      isLoading: true,
      step: "UPLOAD_IPFS",
      birds: [],
    });

    Promise.all(birds).then((list) => {
      const items = list.map((tokenURI) => {
        return [tokenURI, publicRuntimeConfig.MINT_PRICE, 0];
      });

      this.setState({
        step: "CONFIRM_NFT",
      });

      this.contract
        .preSaleMint(items, wallet.account)
        .on("confirmation", (confirmationNumber, receipt) => {
          this.setState(
            {
              birds: out,
            },
            () => {
              this.onConfirmation(confirmationNumber, receipt);
            }
          );
        })
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
      });
    }
  }

  onError() {
    this.setState({
      isLoading: false,
      birds: [],
      confirmationNumber: 0,
      step: null,
    });
  }

  getMintPrice() {
    const { mintCount } = this.state;

    return parseInt(publicRuntimeConfig.MINT_PRICE * mintCount).toString();
  }

  render() {
    const { wallet } = this.props;
    const {
      mintCount,
      isLoading,
      transactionHash,
      step,
      tokenId,
      total,
      birds,
    } = this.state;

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
              <InputNumber
                min={1}
                max={5}
                defaultValue={mintCount}
                onChange={(mintCount) => {
                  this.setState({
                    mintCount,
                  });
                }}
              />

              <MintButton onClick={() => this.mint()} disabled={isLoading}>
                MINT with{" "}
                <span>({Web3.utils.fromWei(this.getMintPrice())} BNB)</span>
              </MintButton>
            </div>
          </>
        )}

        {!!transactionHash && (
          <DetailContent>
            {birds.map((detail, i) => {
              return (
                <div className="bird-item" key={i}>
                  <img src={detail.image} />

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
                </div>
              );
            })}
          </DetailContent>
        )}
      </Wrapper>
    );
  }
}
