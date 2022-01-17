import React, { Component } from "react";

// Components
import Wallet from "../components/Wallet";
import { Layout } from "../components/Layouts";

export default class Index extends Component {
  render() {
    return (
      <Layout>
        <Wallet />
      </Layout>
    );
  }
}
