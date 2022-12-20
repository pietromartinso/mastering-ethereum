contract FunWithNumbers {
  uint constant public tokensPerEth = 10;
  uint constant public weiPerEth = 1e18;
  mapping(address => uint) public balances;

  function buyTokens() public payable {
    // convert wei to eth, then multiply by token rate
    uint tokens = msg.value/weiPerEth*tokensPerEth;
    balances[msg.sender] += tokens;
  }

  function sellTokens(uint tokens) public {
    require(balances[msg.sender] >= tokens);
    uint eth = tokens/tokensPerEth;
    balances[msg.sender] -= tokens;
    msg.sender.transfer(eth*weiPerEth);
  }
}