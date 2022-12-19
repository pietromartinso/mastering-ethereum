contract EtherGame {
  uint public payoutMileStone1 = 3 ether;
  uint public mileStone1Reward = 2 ether;
  uint public payoutMileStone2 = 5 ether;
  uint public mileStone2Reward = 3 ether;
  uint public finalMileStone = 10 ether;
  uint public finalReward = 5 ether;
  uint public depositedWei;

  mapping(address => uint) redeemableEther;

  function play() public payable {
    require(msg.value == 0.5 ether);
    uint currentBalance = depositedWei + msg.value;
    //ensure no players after the game has finished
    require(currentBalance <= finalMileStone);
    
    if(currentBalance == payoutMileStone1){
      redeemableEther[msg.sender] += mileStone1Reward;
    } else if (currentBalance == payoutMileStone2){
      redeemableEther[msg.sender] += mileStone2Reward;
    } else if (currentBalance == finalMileStone){
      redeemableEther[msg.sender] += finalReward;
    }
    depositedWei += msg.value;
    return;
  }

  function claimReward() public {
    // ensure the game is complete
    require(depositedWei == finalMileStone);
  
    // ensure there is a reward to give
    return(redeemableEther[msg.sender] > 0);

    redeemableEther[msg.sender] = 0;
    msg.sender.transfer(transferValue);
  }

}