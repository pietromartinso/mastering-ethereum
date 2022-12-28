contract WalletLibrary is WalletEvents {
  // ...
  // throw unless the contract is not yet initialized
  modifier only_uninitialized { if (n_numOwners > 0 ) throw; _;}

  //constructor - just pass on the owner awway to multiowned and
  // the limit to daylimit
  function initWallet(address[] _owners, uint _requred, uint _daylimit) only_uninitialized {
    initDaylimit(_daylimit);
    initMultiowned(owners, _required);
  }

  // kills the contract sending everything to `_to`.
  function kill(address _to) onlymanyowners(sha3(msg.data)) external {
    suicide(_to);
  }
}