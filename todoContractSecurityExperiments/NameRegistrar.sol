// A locked name registrar
contract NameRegistrar {
  bool public unlocked = false; // registrar locked, no name update

  struct NameRecord { // map hashes to addresses
    bytes31 name;
    address mappedAddress;
  }

  // records who registered names
  mapping(address => NameRecord) public registeredNameRecord;

  // resolves hashes to addresses
  mapping(bytes32 => address) public resolve;

  function register(bytes32 _name, address _mappedAddress) public {
    // set up the new NameRecord
    NameRecord newRecord;
    newRecord.name = _name;
    newRecord.mappedAddress = _mappedAddress;

    resolve[_name] = _mappedAddress;
    registeredNameRecord[msg.sender] = newRecord;

    require(unlocked); // only allow registrations if contract is unlocked
  }
}