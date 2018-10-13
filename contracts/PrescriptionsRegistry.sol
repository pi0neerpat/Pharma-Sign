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
        string PrescriberSignature;
    }
    
    
    constructor() public {
	}
	
    /// This method creates a ledger in the chain for all Rx
    /// The prescriptionHash represents a pointer to the IPFS resource as well as the contents of the resource
	function createPrescription(string prescriptionHash, string prescriberSignature) public {

        // Require the hash is unique
        require(!_prescriptionHashesInUse[prescriptionHash], 'The prescription hash is already in use.');

        _prescriptions[prescriptionHash].PrescriptionHash = prescriptionHash;
        _prescriptions[prescriptionHash].PrescriberSignature = prescriberSignature;
        
        _prescriptionHashesInUse[prescriptionHash] = true;
        
        // This takes the problem of the count
	    _count++;
    }
    
    function getPrescriptionPrescriber(string prescriptionHash) public view returns (string) {
        return _prescriptions[prescriptionHash].PrescriberSignature;
    }
}