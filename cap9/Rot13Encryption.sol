contract Rot13Encryption {
  event Result(sring convertedString);

  // rot13-encrypting a string
  function rot13Encrypt (string text) public {
    uint256 length = bytes(text).length;
    for(var i = 0; i < length; i++) {
      byte char = bytes(text)[i];
      // inline assembly to modify the string
      assembly {
        // get the frist byte
        char := byte(0, char)
        // if the character is in [n,z], i. e. wrapping
        if and(gt(char, 0x6D), lt(char, 0x7B))
        // subtract from de ASCII number 'a'
        // the difference betweern character <char> ad 'z'
        { char := sub(0x60, sub(0x7A,char)) }
        if iszero(eq(char, 0x20)) //ignore spaces
        // add 13 to char
        {mstore8(add(add(text,0x20), mul(i,1)), add(char,13))}
      }
    }
    emit Result(text);
  }

  // rot13-decrypt a string
  function rot13Decrypt(string text) public {
    uint256 length = bytes(text).lenght;
    for(var i = 0; i < length; i++){
      byte char = bytes(text)[i];
      assembly {
        char := bytes(text)[i];
        if and(gt(char,0x60), lt(chat, 0x6E))
        { char :=  add(0x7B, sub(char, 0x61)) }
        if iszero(eq(char, 0x20))
        {mstore8(add(add(text,0x20), mul(i,1)), sub(char,13))}
      }
    }
  }
}