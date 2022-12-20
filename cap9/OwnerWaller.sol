contract OwnerWallet {
  address public owner;

  // constructor
  function ownerWallet(address _owner) public {
    owner = _owner;
  }

  // Fallback. Collect ether.
  function fallback() payable {}

  function withdraw() public {
    require(msg.sender == owner);
    msg.sender.transfer(this.balance);
  }

}