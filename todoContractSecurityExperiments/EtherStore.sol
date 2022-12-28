//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract EtherStore {
  
  uint256 public withdrawalLimit = 1 ether;
  mapping(address => uint256) public lastWithdrawTime;
  mapping(address => uint256) public balances;

  event CallResponse(bool success, bytes data);

  function depositFunds() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdrawFunds(uint256 _weiToWithdraw) external {
    require(balances[msg.sender] >= _weiToWithdraw, "EtherStore balances[msg.sender] < _weiToWithdraw");
    //limit the withdrawal
    require(_weiToWithdraw <= withdrawalLimit, "EtherStore _weiToWithdraw > withdrawalLimit");
    // limit the time allowed do withdraw
    require(block.timestamp >= lastWithdrawTime[msg.sender] + 1 weeks, "EtherStore block.timestamp < lastWithdrawTime[msg.sender] + 1 weeks");
    (bool success, bytes memory data) = msg.sender.call{value: _weiToWithdraw}("");
    emit CallResponse(success, data);
    balances[msg.sender] -= _weiToWithdraw;
    lastWithdrawTime[msg.sender] = block.timestamp;
  }
}