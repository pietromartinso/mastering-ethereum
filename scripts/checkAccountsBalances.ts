import { ethers } from "hardhat";

async function main() {

  const accounts = await ethers.getSigners();

  accounts.map(async (acc) => {
    const balance = await acc.getBalance();
    console.log(acc.address, " - ", balance.toString());
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
