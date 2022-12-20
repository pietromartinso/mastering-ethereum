contract Print{
  event Print(string text);
  
  function rot13Encrypt(string text) public {
    emit Print(text);
  }
}