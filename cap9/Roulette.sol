contract Roulette {
  uint public pastBlockTime; // forces one bet per block

  construtor() public payable {} // initially fund contract

  // fallback function used to make a bet
  function fallback() public payable {
    require(msg.value == 10 ether); // must send 10 ether to play
    require(now != pastBlockTime); //onlye 1 transaction per block
    pastBlockTime = now;

    if(now % 15 == 0) { // winner
      msg.sender.transfer(this.balance);
    }
  }
}