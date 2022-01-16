import React, { Component } from "react";
import Styled from "styled-components";

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
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
