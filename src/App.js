import React, { Component } from "react";

import EthCrypto from "eth-crypto";
//Styles
import "./App.css";
import {
  Grid,
  // List,
  Button,
  // Table,
  // Input,
  Message,
  Form,
  // Card,
  // Divider,
  Segment,
  Header,
  Icon,
  Label
} from "semantic-ui-react";

import ipfsWrapper from "./ipfs";

// Components
import web3 from "./ethereum/web3";

class App extends Component {
  state = {
    IPFSHash: "",
    prescription: "",
    hasError: false,
    pharmacyAddress: "0x1BDd1734a0BF7870C20c794DeBB3C82FAbB66789",
    pharmacyPrivateKey:
      "0x59d0952923cc7f3f335af5e5156e2b7965d98545048b854902874e7da247f146"
  };

  componentDidMount = () => {
    this.loadRegistryContracts();
  };

  loadRegistryContracts = () => {
    // contract addresses hardcoded here
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmitPrescription = () => {
    const { prescription } = this.state;
    this.encryptPrescription(prescription).then(encryptedPrescription => {
      this.uploadPrescriptionToIPFS(encryptedPrescription).then(IPFSHash =>
        this.submitHashToChain(IPFSHash).then(txReceipt =>
          this.setState({ txReceipt, IPFSHash })
        )
      );
    });
  };

  encryptPrescription = (e, { prescription }) => {
    const { pharmacyPrivateKey } = this.state;
    /**
     * EIP 1098 (https://github.com/ethereum/EIPs/pull/1098)
     * Encrypt
     * @param {String} pubKeyTo
     * @param {JSON} data Data to be encrypted (Has to be JSON Object)
     * @returns {JSON} Encrypted message
     */
    const encryptedPrescription = "";
    //  Linnia.util.encrypt(
    //   pharmacyPrivateKey,
    //   prescription
    // );
    return encryptedPrescription;
  };

  uploadPrescriptionToIPFS = (e, { encryptedPrescription }) => {
    // ipfs.add(JSON.stringify(encryptedPrescription));
    var IPFSHash = "testIPFSHash";

    ipfsWrapper.add(encryptedPrescription, (err, ipfsHash) => {
      IPFSHash = ipfsHash;
    });

    return IPFSHash;
  };

  submitHashToChain = (e, { IPFSHash }) => {
    const txReceipt = "testTXReceipt";
    return txReceipt;
  };

  decryptPrescription = (e, { encryptPrescription }) => {
    /**
     * EIP 1098 (https://github.com/ethereum/EIPs/pull/1098)
     * Decrypt
     * @param {String} privKey
     * @param {String} encrypted Encrypted message
     * @returns {String} plaintext
     */
    // Linnia.util.decrypt();
    // do something
  };

  renderInterface() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Header>
              Doctor <Header.Subheader>portal</Header.Subheader>
            </Header>
            {this.renderDoctor()}
          </Grid.Column>
          <Grid.Column>
            <Header>
              Pharmacy
              <Header.Subheader>portal</Header.Subheader>
            </Header>
            {this.renderPharmacy()}
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  renderDoctor() {
    return (
      <Segment textAlign="left">
        <Form
          error={!!this.state.errorMessage}
          onSubmit={this.handleSubmitPrescription}
        >
          <Grid columns={2}>
            <Grid.Column>
              <Form.Input
                inline
                name="doctorName"
                label="Doctor Name"
                placeholder="first-name last-name"
                value={this.state.patientDOB}
                onChange={this.handleChange}
              />
              <Form.Input
                inline
                name="patientName"
                label="Patient Name"
                placeholder="first-name last-name"
                value={this.state.patientName}
                onChange={this.handleChange}
              />
              <Form.Input
                inline
                name="patientDOB"
                label="Patient Date of Birth"
                placeholder="mm/dd/yyyy"
                value={this.state.patientDOB}
                onChange={this.handleChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input inline label="Drug Name">
                {/* <Form.Dropdown
                  placeholder="Main, Ropsten, Rinkeby ..."
                  selection
                  inline
                  name="network"
                  onChange={this.handleChange}
                  options={[
                    { key: "Main", value: "main", text: "Main" },
                    { key: "Ropsten", value: "ropsten", text: "Ropsten" },
                    { key: "Rinkeby", value: "rinkeby", text: "Rinkeby" },
                    { key: "Kovan", value: "kovan", text: "Kovan" },
                    { key: "local-host", value: "local", text: "local-host" }
                  ]}
                  value={this.state.network}
                /> */}
              </Form.Input>
              <Button color="green" content="Submit" />
              <p>makeadapp.com{this.state.mnemonic || "/ ..."}</p>
            </Grid.Column>
          </Grid>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
      </Segment>
    );
  }
  renderPharmacy() {
    return <Segment textAlign="left" />;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pharma-Sign</h1>
        </header>
        <Segment>{this.renderInterface()}</Segment>
      </div>
    );
  }
}

export default App;
