pragma solidity ^0.4.23;

/// The purpose of this contract is to track a prescription and validate
/// its integrity
contract PrescriptionsRegistry {
    
	// This will incurr in double storage, but we must ensure the hashes are not reused
	mapping(string => bool) private _prescriptionHashesInUse;
	mapping(string => Prescription) private _prescriptions;
	
    uint256 private _count;
	
    struct Prescription {
        string PrescriptionHash;
        address PrescriberAddress;
    }
    
    function stringNotNullNorEmpty(string value) private pure returns (bool) {
        bytes memory tempEmptyStringTest = bytes(value); // Uses memory
        return (tempEmptyStringTest.length > 0);
    }

    constructor() public {
	}
	
    /// This method creates a ledger in the chain for all Rx
    /// The prescriptionHash represents a pointer to the IPFS resource as well as the contents of the resource
	function createPrescription(string prescriptionHash) public {

        require(stringNotNullNorEmpty(prescriptionHash), 'A prescription hash must be provided');

        // Require the hash is unique
        require(!_prescriptionHashesInUse[prescriptionHash], 'The prescription hash is already in use.');

        _prescriptions[prescriptionHash].PrescriptionHash = prescriptionHash;
        _prescriptions[prescriptionHash].PrescriberAddress = msg.sender;
        
        _prescriptionHashesInUse[prescriptionHash] = true;
        
        // This takes the problem of the count
	    _count++;
    }
    
    function getPrescriptionPrescriber(string prescriptionHash) public view returns (address) {
        return _prescriptions[prescriptionHash].PrescriberAddress;
    }
}