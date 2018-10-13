pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PrescriptionsRegistry.sol";

contract TestPrescriptionsRegistry {

  function testCreatePrescription() public {

    PrescriptionsRegistry registry = PrescriptionsRegistry(DeployedAddresses.PrescriptionsRegistry());

    registry.createPrescription('ABC');

    // How do I retrieve the account
    uint expected = 89;

    Assert.equal(registry.getPrescriptionPrescriber(), expected, "It should store the value 89.");
  }

}
