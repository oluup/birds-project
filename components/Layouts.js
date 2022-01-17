import React, { Component } from "react";
import Styled from "styled-components";
import Head from 'next/head';

const HeaderContent = Styled.header`
    text-align: center;
    margin: 20px 0;

    p {
        font-size: 50px;
    }
`;

const FooterContent = Styled.header`
    text-align: center;
    margin: 20px 0;

    b {
        text-decoration: underline;
    }
`;

const Header = () => {
  return (
    <HeaderContent>
      <img src="/static/images/logo.png" width={100} />
      <p>Bit Birds</p>
    </HeaderContent>
  );
};

const Footer = () => {
  return (
    <FooterContent>
      <b>Bit Birds</b> is a oluup test collection.
    </FooterContent>
  );
};

export class Layout extends Component {
  render() {
    return (
      <div className="container">
        <Head>
          <title>Bit Birds NFT ~ Test collection for Oluup.</title>
          <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
        
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
