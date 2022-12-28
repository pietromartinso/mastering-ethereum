//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract ReentrancyVictim {
  
  mapping(address => uint256) public balances;

  function depositFunds() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdrawFunds() public {

    uint bal = balances[msg.sender];
    require(bal > 0, "The msg.sender doesn't have enough balance");

    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send Ether");

    balances[msg.sender] = 0;
  }

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }
}