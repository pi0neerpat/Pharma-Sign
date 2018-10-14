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
import contract from "truffle-contract";

import PrescriptionsRegistry from "./ethereum/PrescriptionsRegistry";

// Components
import web3 from "./ethereum/web3";

class App extends Component {
  state = {
    IPFSHash: "",
    patientName: "",
    patientDOB: "",
    doctorName: "",
    drugName: "",
    drugQuantity: "",
    hasError: false,
    pharmacyAddress: "0x94A5168C78e41c637C1B45544363d76034949Dc5",
    pharmacyPublicKey:
      "2b949f11b48fff00a4d15bd26abd373fe69f71559d8613c179d6c6d146c4a814f12eaa24878e6fb63ad6843558bb2ae0bc1043fd96bfe0fcc8a7f81e88768a17",
    pharmacyPrivateKey:
      "0xd42ea3b08d23fc87e04fba10acafaff85bb01827fdc6a0547b7de59a347abfd5",
    doctorAddress: "0x1BDd1734a0BF7870C20c794DeBB3C82FAbB66789"
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

  handleSubmitPrescription = async () => {
    const {
      patientName,
      patientDOB,
      doctorName,
      drugName,
      drugQuantity
    } = this.state;

    const prescriptionObject = {
      doctorName: doctorName,
      patientName: patientName,
      patientDOB: patientDOB,
      drugName: drugName,
      drugQuantity: drugQuantity
    };
    const prescriptionString = JSON.stringify(prescriptionObject);
    const encryptedPrescription = this.encryptPrescription(prescriptionString);
    const IPFSHash = await this.uploadPrescriptionToIPFS(encryptedPrescription);
    const txReceipt = await this.submitHashToChain(IPFSHash);
  };

  encryptPrescription = async prescription => {
    const { pharmacyPublicKey } = this.state;
    console.log("encrypting prescription");
    const encryptedObject = await EthCrypto.encryptWithPublicKey(
      pharmacyPublicKey,
      prescription
    );
    console.log(JSON.stringify(encryptedObject));
    return encryptedObject;
  };

  uploadPrescriptionToIPFS = (e, encryptedPrescription ) => {
    var IPFSHash = "";

    ipfsWrapper.files.add(encryptedPrescription, (err, ipfsHash) => {

      console.log('upload worked',ipfsHash);
      IPFSHash = ipfsHash;
    });

    return IPFSHash;
  };

  //Getting the uploaded file via hash code.
  downloadPrescriptionFromIPFS = (e, ipfsHash) => {
    var encryptedPrescription = '';
    ipfsWrapper.files.get(ipfsHash, function (err, files) {
        files.forEach((file) => {
          encryptedPrescription = file.content.toString('utf8');
        });
      });

    return encryptedPrescription;
  };

  submitHashToChain = async IPFSHash => {
    console.log("Submitting IPFS hash to ETH public");
    const { doctorAddress } = this.state;
    const PrescriptionsRegistryContract = contract(PrescriptionsRegistry);
    PrescriptionsRegistryContract.setProvider(web3.currentProvider);
    const instance = PrescriptionsRegistryContract.at(
      "0x0bfa1c4baa40d1b81def0c07f402692a62f66aef"
    );
    const txReceipt = await instance.createPrescription(IPFSHash, {
      from: doctorAddress
    });

    console.log(txReceipt);
    return txReceipt;
  };

  decryptPrescription = (e, { encryptPrescription }) => {
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
                <Form.Dropdown
                  placeholder=""
                  selection
                  inline
                  name="drugName"
                  onChange={this.handleChange}
                  options={[
                    {
                      key: "Hydrocodone",
                      value: "Hydrocodone",
                      text: "Hydrocodone"
                    },
                    { key: "Methadone", value: "Methadone", text: "Methadone" },
                    { key: "Codeine", value: "Codeine", text: "Codeine" }
                  ]}
                  value={this.state.drugName}
                />
              </Form.Input>
              <Form.Input
                inline
                name="drugQuantity"
                label="Drug Quantity"
                placeholder="mg"
                value={this.state.drugQuantity}
                onChange={this.handleChange}
              />
              <Button color="green" content="Submit" />
            </Grid.Column>
          </Grid>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
      </Segment>
    );
  }

  renderPharmacy() {

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
