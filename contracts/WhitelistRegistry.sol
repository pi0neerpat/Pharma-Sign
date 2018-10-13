pragma solidity ^0.4.23;

contract WhitelistRegistry {
    
    mapping(address => bool) public verifiedDoctors;
    mapping(address => bool) public verifiedPharmacies;
    mapping(address => string) public doctorNames;
    mapping(address => string) public pharmacyNames;

    // constructor
    function WhitelistRegistry() {
        
        // pre-populate doctor mapping with doctor public keys and names
        verifiedDoctors[0x1BDd1734a0BF7870C20c794DeBB3C82FAbB66789] = true;
        verifiedDoctors[0x6a8bd7c2c0d0c6d7ffdd1f6d3d82f83a4c17d22e] = true;
        verifiedDoctors[0x6d1d4f6231cc9d28846827c7744ee78ee507928e] = true;
        
        doctorNames[0x1BDd1734a0BF7870C20c794DeBB3C82FAbB66789] = "Dr. John Smith";
        doctorNames[0x6a8bd7c2c0d0c6d7ffdd1f6d3d82f83a4c17d22e] = "Dr. Elizabeth Hughes";
        doctorNames[0x6d1d4f6231cc9d28846827c7744ee78ee507928e] = "Dr. Eric Ward";
        
        // pre-populate pharmacy mapping with pharmacy public keys and names
        verifiedPharmacies[0x94A5168C78e41c637C1B45544363d76034949Dc5] = true;
        verifiedPharmacies[0x0b70470e3d2b5f264e8e5add8a8ff0e8cd3b6062] = true;
        verifiedPharmacies[0x40f6acb9da087cb9ff9e602a01df3fb6e3157a14] = true;
        verifiedPharmacies[0x05f8ac21e6b8c483c402472ed738aea13d07c31e] = true;
        
        pharmacyNames[0x94A5168C78e41c637C1B45544363d76034949Dc5] = "CVS Health";
        pharmacyNames[0x0b70470e3d2b5f264e8e5add8a8ff0e8cd3b6062] = "Walgreens Pharmacy";
        pharmacyNames[0x40f6acb9da087cb9ff9e602a01df3fb6e3157a14] = "Riteaid Pharmacy";
        pharmacyNames[0x05f8ac21e6b8c483c402472ed738aea13d07c31e] = "Walmart Pharmacy";

    }
    
    // this method checks whether a given public key represents a valid doctor
    function isValidDoctor (address _doctorPublicKey) public view returns (bool) {
        return verifiedDoctors[_doctorPublicKey];
    }
    
    // this method checks whether a given public key represents a valid pharmacy
    function isValidPharmacy (address _pharmacyPublicKey) public view returns (bool) {
        return verifiedPharmacies[_pharmacyPublicKey];
    }
    
    // this method returns the name associated with a doctor's public key
    function getDoctorName (address _doctorPublicKey) public view returns (string) {
        return doctorNames[_doctorPublicKey];
    }
    
    // this method returns the name associated with a pharmacy's public key
    function getPharmacyName (address _pharmacyPublicKey) public view returns (string) {
        return pharmacyNames[_pharmacyPublicKey];
    }
    
}