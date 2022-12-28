import "./Rot13Encryption.sol";

//encrpt your top-secret info
contract EncryptionContract {
  ////library for encryption
  Rot13Encryption encryptionLibrary;

  // constructor - initializ the library
  constructor(Rot13Encryption _EncryptionLibrary){
    encryptionLibrary = _EncryptionLibrary;
  }

  function encryptPrivateData(string privateInfo) {
    // potentially do some operations here
    encryptionLibrary.rot13Encrypt(privateInfo);
  }
}