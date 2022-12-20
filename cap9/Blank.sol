contract Blank {
  event Print(string text);
  function fallback(){
    emit Print("Here");
    // put malicious code here and it will run
  }
}