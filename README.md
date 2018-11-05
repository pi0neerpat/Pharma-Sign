<h1 align="center"> Pharma-Sign </h1>

![logo](https://github.com/blockchainbuddha/Pharma-Sign/blob/13aa213f1dc89567543647c0fbb6d625fb7a417d/pharma_sign_logo.png)

Table of Contents
=================

* [Introduction](#intro)
* [Mission statement](#mission)
* [Key Features](#key_features)
* [Planned Features](#planned_features)
* [Running the app](#run)
* [Smart contract example](#contract)
* [Credits](#credits)
* [Contact](#contact)

<a name="intro"></a>
## Introduction

Project for preventing prescription fraud using the Ethereum blockchain, as part of the "Hack the Epidemic" hackathon co-sponsored by ConsenSys Health and Booz Allen Hamilton (October 12-14, 2018).

<a name="mission"></a>
## Mission statement

To prevent fraud, reduce costs, and improve experiences for Providers, Pharmacies, and Patients in the prescription issuance process.

<a name="key_features"></a>
## Key features

- Fill out prescription data via ReactJS web form
- Encrypt prescription data with pharmacy's public key
- Upload encrypted prescription data to IPFS
- Store the IPFS location hash in smart contract on ETH-public
- Encode address of ETH-public smart contract in QR code

<a name="planned_features"></a>
## Planned features

- Add Truffle/JS tests to ensure successfull encryption and decryption of prescriptions
- Validate preferred pharmacy against External Pharmacy Registry via smart contract
- Validate doctor's National Provider Identifier (NPI) number against External Provider Registry
- Enforce prescription expiry date and number of refills
- Test Pharma-Sign system on consortium blockchain
- Send generated QR codes to patient's mobile app, wallet, or uPort account
- Use AI/Machine Learning to identify patterns and detect fraud/waste/abuse in prescription data

<a name="diagram"></a>
## Users, Roles, and Actions
![logo](https://github.com/blockchainbuddha/Pharma-Sign/blob/master/pharma_sign_diagram.png)

<a name="run"></a>
## Running the app

<p>To clone and run this application, you'll need <a href="https://git-scm.com" rel="nofollow">Git</a> and <a href="https://nodejs.org/en/download/" rel="nofollow">Node.js</a> (which comes with <a href="http://npmjs.com" rel="nofollow">npm</a>) installed on your computer. From your command line:</p>

```
# Clone this repository
$ git clone https://github.com/blockchainbuddha/Pharma-Sign

# Go into the repository
$ cd Pharma-Sign

# Install dependencies
$ npm install

# Run the app
$ npm start
```
A local Ganache blockchain server will start concurrently for testing purposes.

<a name="contract"></a>
## Smart contract example - PrescriptionsRegistry.sol

```solidity
// This method creates a ledger in the chain for all Rx
// The prescriptionHash represents a pointer to the IPFS resource as well as the contents of the resource

function createPrescription(string prescriptionHash) public {

  require(stringNotNullNorEmpty(prescriptionHash), 'A prescription hash must be provided');

  // Require the hash is unique
  require(!_prescriptionHashesInUse[prescriptionHash], 'The prescription hash is already in use.');

  _prescriptions[prescriptionHash].PrescriptionHash = prescriptionHash;
  _prescriptions[prescriptionHash].PrescriberAddress = msg.sender;      
  _prescriptionHashesInUse[prescriptionHash] = true;
        
  // Increment prescription count
  _count++;
}
    
function getPrescriptionPrescriber(string prescriptionHash) public view returns (address) {
  return _prescriptions[prescriptionHash].PrescriberAddress;
}
```
<a name="credits"></a>
## Credits
This software uses the following development frameworks and open source packages:


* [Truffle](https://truffleframework.com/docs) - A development framework for Ethereum which makes it easy to deploy contracts to both public and private networks.
* [Ganache](https://truffleframework.com/ganache) - Quickly fire up a personal Ethereum network to run tests, execute commands and inspect state.
* [Web3](https://github.com/ethereum/web3.js/) - A javascript API to allow decentralized applications to talk with a node. Maintained and managed by the core Ethereum project.
* [IPFS](https://ipfs.io/) -  A protocol and network designed to create a content-addressable, peer-to-peer method of storing and sharing hypermedia in a distributed file system.
* [Metamask](https://metamask.io/) - A browser extension that makes it easy for users to interact and sign transactions for decentralized applications.

<a name="contact"></a>
## Contact

* [Patrick G.](https://twitter.com/pi0neerpat)
* [Uzair M.](https://www.linkedin.com/in/uziminhas/)
* [Moises J.](https://www.linkedin.com/in/moisesjaramillo/)
* [Changrong Ji](https://www.linkedin.com/in/changrongji/)



