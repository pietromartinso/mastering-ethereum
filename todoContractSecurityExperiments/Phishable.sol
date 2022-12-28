contract Phishable.sol {
  address public owner;

  constructor (address _owner) {
    owner = _owner;
  }

  function fallback() public payable {} // collect ether

  function withdrawAll(address _recipient) public {
    require(tx.origin == owner);
    _recipient.transfer(this.balance);
  }
}