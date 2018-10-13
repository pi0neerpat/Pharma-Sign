var prescriptionsRegistry = artifacts.require("./PrescriptionsRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(prescriptionsRegistry);
};
