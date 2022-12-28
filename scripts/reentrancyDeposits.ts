import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {

  const provider = ethers.getDefaultProvider("goerli");
  const accounts = await ethers.getSigners();

  const ReentrancyVictim = await ethers.getContractFactory("ReentrancyVictim");
  var reentrancyVictim = ReentrancyVictim.attach(process.env.VICTIM_ADDRESS as string);

  let response;
  let result;

  var balance = await provider.getBalance(reentrancyVictim.address);
  console.log("[DEBUG] CONTRACT BALANCE BEFORE *DEPOSITS*: ", balance);

  console.log("[DEBUG] Depositting 1...");
  response = await reentrancyVictim.connect(accounts[0]).depositFunds({value: "20000000000000000"});
  console.log("[DEBUG] 1st deposited... Response: ", response);

  console.log("[DEBUG] Depositting 2...");
  response = await reentrancyVictim.connect(accounts[1]).depositFunds({value: "20000000000000000"});
  console.log("[DEBUG] 2nd deposited... Response: ", response);

  console.log("[DEBUG] Depositting 3 - Test to withdraw...");
  response = await reentrancyVictim.connect(accounts[2]).depositFunds({value: "10000000000000000"});
  result = await response.wait();
  console.log("[DEBUG] 3rd deposited... Result: ", result);

  var balance = await provider.getBalance(reentrancyVictim.address);
  console.log("[DEBUG] CONTRACT BALANCE AFTER *DEPOSITS*: ", balance);

  console.log("[DEBUG] Withdrawing 3rd deposit - Test to withdraw...");
  response = await reentrancyVictim.connect(accounts[2]).withdrawFunds({gasPrice: "10000000000", gasLimit: "30000000"});
  result = await response.wait();
  console.log("[DEBUG] Withdraw test executed... Result: ", result);

  var balance = await provider.getBalance(reentrancyVictim.address);
  console.log("[DEBUG] CONTRACT BALANCE AFTER --- WITHDRAW --- : ", balance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
