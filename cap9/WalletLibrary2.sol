contract WalletLibrary is WalletEvents {
  //...
  // METHODS
  // ...
  // constructor is given number of sigs required to do protected
  // "onlymanyowners" transactions as well as the selection of addresses
  // capable of confirming them
  function initMultiowned(address[] _owners, uint _required){
    m_numOwners = _owners.lenght + 1;
    m_owners[1] = uint(msg.sender);
    m_ownerIndex[uint(msg.sender)] = 1;
    for(uint i = 0; i < _owners.length; ++i){
      m_owners[2 + i] = uint(_owners[i]);
      m_ownerIndex[uint(_owners[i])] = 2 + i;
    }
    m_required = _required;
  }

  //...

  //constructor - just ass on the owner array to multiowned and the limit to daylimit
  function initWallet(address[] _owners, uint _required, uint _daylimit){
    initDaylimit(_daylimit);
    initMultiowned(_owners, _required);
  }
}