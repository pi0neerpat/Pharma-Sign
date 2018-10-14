import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import EthCrypto from "eth-crypto";

//Styles
import "./App.css";
import {
  Grid,
  // List,
  Button,
  // Table,
  Container,
  Message,
  Form,
  // Card,
  // Divider,
  Segment,
  Header,
  Icon,
  Label
} from "semantic-ui-react";

// Other modules
const IPFS = require("ipfs-mini");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});
var QRCode = require("qrcode.react");

//Web3 and Contract for working with Ethereum
import web3 from "./ethereum/web3";
import contract from "truffle-contract";
import PrescriptionsRegistry from "./ethereum/PrescriptionsRegistry";

class App extends Component {
  state = {
    patientName: "",
    patientDOB: "",
    doctorName: "",
    drugName: "",
    drugQuantity: "",
    IPFSHash: "",
    hasError: false,
    show: false,
    pharmacyAddress: "0x94A5168C78e41c637C1B45544363d76034949Dc5",
    pharmacyPublicKey:
      "2b949f11b48fff00a4d15bd26abd373fe69f71559d8613c179d6c6d146c4a814f12eaa24878e6fb63ad6843558bb2ae0bc1043fd96bfe0fcc8a7f81e88768a17",
    pharmacyPrivateKey:
      "0xd42ea3b08d23fc87e04fba10acafaff85bb01827fdc6a0547b7de59a347abfd5",
    doctorAddress: "0x1BDd1734a0BF7870C20c794DeBB3C82FAbB66789",
    loadingDoctor: false,
    errorMessageDoctor: "",
    loadingPharmacy: false,
    errorMessagePharmacy: "",
    encryptedPrescr: "",
    rxLookup: false,
    doctorValid: false,
    prescriptionValid: false,
    ipfsHashLookup: "",
    encryptedPrescriptionLookup: ""
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
    this.setState({ loadingDoctor: true, errorMessageDoctor: "" });
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
    const encryptedPrescription = await this.encryptPrescription(
      prescriptionString
    );
    const IPFSHash = await this.uploadPrescriptionToIPFS(encryptedPrescription);
    this.submitHashToChain(IPFSHash);
    this.setState({
      loadingDoctor: false,
      doctorName: "",
      patientName: "",
      patientDOB: "",
      drugName: "",
      drugQuantity: "",
      encryptedPrescr: JSON.stringify(encryptedPrescription),
      IPFSHash: IPFSHash
    });
  };

  encryptPrescription = async prescription => {
    const { pharmacyPublicKey } = this.state;
    console.log("encrypting prescription");
    const encryptedObject = await EthCrypto.encryptWithPublicKey(
      pharmacyPublicKey,
      prescription
    );
    this.setState({
      encryptedPrescr: JSON.stringify(encryptedObject, null, 1)
    });
    console.log(JSON.stringify(encryptedObject, null, 1));
    return encryptedObject;
  };

  uploadPrescriptionToIPFS = async encryptedPrescription => {
    const hash = await ipfs.addJSON(
      { somevalue: 2, name: "Nick" },
      (err, result) => {
        this.setState({ IPFSHash: result });
      }
    );
    return hash;
  };

  submitHashToChain = async IPFSHash => {
    console.log("Submitting IPFS hash to ETH public");
    const { doctorAddress } = this.state;
    const PrescriptionsRegistryContract = contract(PrescriptionsRegistry);
    PrescriptionsRegistryContract.setProvider(web3.currentProvider);
    const instance = PrescriptionsRegistryContract.at(
      "0x0bfa1c4baa40d1b81def0c07f402692a62f66aef"
    );
    const response = await instance.createPrescription(IPFSHash, {
      from: doctorAddress
    });
    const txReceiptURL = `https://ropsten.etherscan.io/tx/${response.tx}`;
    this.setState({ txReceiptURL });
    console.log(txReceiptURL);
  };

  // Pharmacy methods
  viewPrescriptionFromEncrypted = async () => {
    this.setState({
      loadingPharmacy: true,
      errorMessagePharmacy: "",
      rxLookup: true
    });
    const { encryptedPrescriptionLookup } = this.state;
    const prescription = await this.decryptPrescription(
      encryptedPrescriptionLookup
    );
    this.setState({
      doctorName: prescription.doctorName,
      patientName: prescription.patientName,
      patientDOB: prescription.patientDOB,
      drugName: prescription.drugName,
      drugQuantity: prescription.drugQuantity,
      doctorValid: true,
      prescriptionValid: true,
      loadingPharmacy: false
    });
  };

  viewPrescriptionFromIPFS = async () => {
    this.setState({
      loadingPharmacy: true,
      errorMessagePharmacy: "",
      rxLookup: true
    });
    const { ipfsHashLookup } = this.state;
    const encryptedPrescription = await this.downloadIPFSPrescription(
      ipfsHashLookup
    );
    const prescription = await this.decryptPrescription(encryptedPrescription);
    this.setState({
      doctorName: prescription.doctorName,
      patientName: prescription.patientName,
      patientDOB: prescription.patientDOB,
      drugName: prescription.drugName,
      drugQuantity: prescription.drugQuantity,
      doctorValid: true,
      prescriptionValid: true,
      loading: false
    });
  };

  downloadIPFSPrescription = async prescriptionIPFSHash => {
    var encryptedPrescription = "";
    // ipfsWrapper.files.get(prescriptionIPFSHash, function(err, files) {
    //   files.forEach(file => {
    //     encryptedPrescription = file.content.toString("utf8");
    //   });
    // });

    console.log("downloaded file", encryptedPrescription);
    return encryptedPrescription;
  };

  decryptPrescription = async encryptedPrescription => {
    const { pharmacyPrivateKey } = this.state;
    const decryptedPrescription = await EthCrypto.decryptWithPrivateKey(
      pharmacyPrivateKey,
      JSON.parse(encryptedPrescription)
    );
    console.log("decrypted Prescription: " + decryptedPrescription);
    const prescriptionObject = JSON.parse(decryptedPrescription);
    return prescriptionObject;
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
        <Segment>{this.renderQR()}</Segment>
      </div>
    );
  }

  renderDoctor() {
    if (this.state.rxLookup === false) {
      return (
        <Segment textAlign="left">
          <Form
            error={!!this.state.errorMessageDoctor}
            onSubmit={this.handleSubmitPrescription}
          >
            <Grid columns={2}>
              <Grid.Column>
                <Form.Input
                  inline
                  name="doctorName"
                  label="Doctor Name"
                  placeholder="first-name last-name"
                  value={this.state.doctorName}
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
                      {
                        key: "Methadone",
                        value: "Methadone",
                        text: "Methadone"
                      },
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
                <Button
                  color="green"
                  content="Submit"
                  loading={this.state.loadingDoctor}
                />
              </Grid.Column>
            </Grid>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <Message compact success hidden={!this.state.txReceiptURL}>
              Success! View this transaction{" "}
              <a href={this.state.txReceiptURL}>on etherescan</a>
            </Message>
          </Form>
        </Segment>
      );
    }
  }

  renderQR() {
    return (
      <div>
        <Segment textAlign="left" hidden={!this.state.encryptedPrescr}>
          <Header>Your Prescription:</Header>
          <QRCode
            value={`{rx: ${this.state.encryptedPrescr}, ipfsHash: ${
              this.state.IPFSHash
            }`}
            color={"#67a814"}
            size={120}
          />
          <Container text>
            <p>Encrypted Rx: {this.state.encryptedPrescr}</p>
            <p>Rx IPFS Hash: {this.state.IPFSHash}</p>
          </Container>
        </Segment>
      </div>
    );
  }

  renderPrescription() {
    const {
      patientName,
      patientDOB,
      doctorName,
      drugName,
      drugQuantity,
      doctorValid,
      prescriptionValid
    } = this.state;
    if (this.state.rxLookup === true) {
      return (
        <Segment textAlign="left">
          <p>Doctor name: {doctorName}</p>
          <p>Patient name: {patientName}</p>
          <p>Patient DOB: {patientDOB}</p>
          <p>Drug name: {drugName}</p>
          <p>Drug Quantity: {drugQuantity}</p>
          <p>Doctor Verified: {doctorValid}</p>
          <p>Prescription Valid: {prescriptionValid}</p>
        </Segment>
      );
    }
  }

  renderPharmacy() {
    return (
      <div>
        <Form
          error={!!this.state.errorMessageDoctor}
          onSubmit={this.viewPrescriptionFromIPFS}
        >
          <Form.Input
            inline
            name="ipfsHashLookup"
            label="Lookup Prescription"
            placeholder="IPFS hash"
            value={this.state.ipfsHashLookup}
            onChange={this.handleChange}
          />

          <Button
            color="blue"
            content="Lookup from IPFS"
            loading={this.state.loadingPharmacy}
          />
        </Form>
        <Form onSubmit={this.viewPrescriptionFromEncrypted}>
          <Form.Input
            inline
            name="encryptedPrescriptionLookup"
            label="Encrypted prescription Lookup"
            placeholder="Encrypted Rx"
            value={this.state.encryptedPrescriptionLookup}
            onChange={this.handleChange}
          />
          <Button
            color="blue"
            content="Lookup from QR"
            loading={this.state.loadingPharmacy}
          />
          <Message
            error
            header="Oops!"
            content={this.state.errorMessagePharmacy}
          />
        </Form>
        {this.renderPrescription()}
      </div>
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
