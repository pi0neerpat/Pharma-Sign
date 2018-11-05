<h1 align="center"> Pharma-Sign </h1>

![logo](https://github.com/blockchainbuddha/Pharma-Sign/blob/13aa213f1dc89567543647c0fbb6d625fb7a417d/pharma_sign_logo.png)

Table of Contents
=================

* [Introduction](#intro)
* [Mission statement](#mission)
* [Key Features](#key_features)
* [Planned Features]()
* [Run the app]()
* [Contact]()

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

## Planned features

- Add Truffle/JS tests to ensure successfull encryption and decryption of prescriptions
- Validate preferred pharmacy against External Pharmacy Registry via smart contract
- Validate doctor's National Provider Identifier (NPI) number against External Provider Registry
- Enforce prescription expiry date and number of refills
- Test Pharma-Sign system on consortium blockchain
- Send generated QR codes to patient's mobile app, wallet, or uPort account
- Use AI/Machine Learning to identify patterns and detect fraud/waste/abuse in prescription data

## Run the app

1.  Run `npm install`
2.  Run `npm start`

A local Ganache blockchain server will start concurrently for testing purposes.

## Contact

[Patrick](https://twitter.com/pi0neerpat)
