contract FibonacciBalance {
  address public fibonacciLibrary;
  // the current Fibonacci number to withdraw
  uint public calcularedFibNumber;
  // the startin Fibonacci sequence number
  uint public start = 3;
  uint public withdrawalCounter;
  // the Fibonacci function selector
  bytes4 constant fibSig = bytes4(sha3("setFibonacci(uint256)"));

  // constructor - loads the cuntract with ether
  constructor(address _fibonacciLibrary) public payable {
    fibonacciLibrary = _fibonacciLibrary;
  }

  function withdraw() {
    withdrawalCounter += 1;
    // calculate the Fibonacci number for the current withdrawal user-
    // this sets calculatedFibNumber
    require(fibonacciLibrary.delegatecall(fibSig, withdrawalCounter));
    msg.snder.transfer(calculatedFibNumber * 1 ether);
  }

  // allow users to call Fibonacci library functions
  function fallback() public {
    require(fibonacciLibrary.delegatecall(msg.data));
  }

}