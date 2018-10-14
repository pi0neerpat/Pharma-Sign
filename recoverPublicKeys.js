const EthCrypto = require("eth-crypto");

privateKeys = [
  "0xd42ea3b08d23fc87e04fba10acafaff85bb01827fdc6a0547b7de59a347abfd5"
];

privateKeys.forEach(privateKey => {
  const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
  console.log(publicKey);
});
