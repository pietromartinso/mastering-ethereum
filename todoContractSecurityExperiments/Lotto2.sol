// ...
function cash(uint roundIndex, uint dubpotIndex){
  var subpotsCount = getSubpotsCount(roundIndex);

  if(subpotIndex >= subpotsCount)
    return;

  var decisionBlockNumber = getDecisionBlockNumber(roundIndex, subpotIndex);

  if(decisionBlockNumber > block.number)
    return;

  if(rounds[roundIndex].isCashed(subpotIndex))
    return;
  // Subpots can only be cashed once. This is to prevent double payouts

  var winner = valvulateWinner(roundIndex, subpotIndex);
  var subpot = getSubpot(roundIndex);

  winner.send(subpot);

  rounds[roundIndex].isCashed[subpotIndex] = true;
  // Mark the round as cashed

}
// ...