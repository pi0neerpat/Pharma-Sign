const EthCrypto = require("eth-crypto");

privateKeys = [
  "0x96ec0e2cb7f9c8260e2e0fa33761a671a15d7f669825fe35f727774bd9881fb5"
];

privateKeys.forEach(privateKey => {
  const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
  console.log(publicKey);
});
