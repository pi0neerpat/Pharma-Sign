import React, { Component } from "react";

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

// Components
import web3 from "./ethereum/web3";

class App extends Component {
  state = {
    IPFSHash: "",
    prescription: "",
    hasError: false
  };

  componentDidMount = () => {
    this.loadExistingContract();
  };

  loadRegistry = () => {};

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleUploadIPFS = () => {
    const { prescription } = this.state;

    console.log("Uploading to IPFS...");
    //Upload to IPFS

    this.setState({ IPFSHash: "string" });
  };

  // send() methods alter the contract state, and require gas.
  handleSubmitIPFSHash = (e, { name }) => {};

  handleGeneratePrescription = (e, { name }) => {};

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
          onSubmit={this.handleGenerateURL}
        >
          <Grid columns={2}>
            <Grid.Column>
              <Form.Input
                inline
                name="contractName"
                label="DApp name"
                placeholder="(optional)"
                value={this.state.contractName}
                onChange={this.handleChange}
              />
              <Form.TextArea
                label="ABI (application binary interface)"
                placeholder="ABI"
                name="abiRaw"
                value={this.state.abiRaw}
                onChange={this.handleChangeABI}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                inline
                name="contractAddress"
                label="Contract address"
                placeholder="0xab123..."
                value={this.state.contractAddress}
                onChange={this.handleChange}
              />
              <Form.Input inline label="Network">
                <Form.Dropdown
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
                />
              </Form.Input>
              <Button color="green" content="Get Shareable Link" />
              <p>makeadapp.com{this.state.mnemonic || "/ ..."}</p>
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
          onSubmit={this.handleGenerateURL}
        >
          <Grid columns={2}>
            <Grid.Column>
              <Form.Input
                inline
                name="contractName"
                label="DApp name"
                placeholder="(optional)"
                value={this.state.contractName}
                onChange={this.handleChange}
              />
              <Form.TextArea
                label="ABI (application binary interface)"
                placeholder="ABI"
                name="abiRaw"
                value={this.state.abiRaw}
                onChange={this.handleChangeABI}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                inline
                name="contractAddress"
                label="Contract address"
                placeholder="0xab123..."
                value={this.state.contractAddress}
                onChange={this.handleChange}
              />
              <Form.Input inline label="Network">
                <Form.Dropdown
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
                />
              </Form.Input>
              <Button color="green" content="Get Shareable Link" />
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
