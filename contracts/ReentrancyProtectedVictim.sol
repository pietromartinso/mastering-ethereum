//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract ReentrancyProtectedVictim {
  
  mapping(address => uint256) public balances;

  bool private reentrant;

  constructor() {
    reentrant = false; 
  }

  function depositFunds() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdrawFunds() public {

    require(reentrant != true, "Withdraw reentrant call atempt");
    reentrant = true;
    //----- Entering Critical Region -----
    uint bal = balances[msg.sender];
    require(bal > 0, "The msg.sender doesn't have enough balance");

    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send Ether");

    balances[msg.sender] = 0;
    //----- Leaving Critical Region -----
    reentrant = false;
  }

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }
}