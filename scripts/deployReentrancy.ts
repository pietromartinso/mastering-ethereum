import { ethers } from "hardhat";

import * as fs from "fs";
import * as os from "os";
import dotenv from "dotenv";

dotenv.config();

async function main() {

  const accounts = await ethers.getSigners();

  const ReentrancyVictim = await ethers.getContractFactory("ReentrancyVictim");
  const reentrancyVictim = await ReentrancyVictim.deploy();

  await reentrancyVictim.deployed();
  
  console.log(`Deployed Victim to ${reentrancyVictim.address}`);

  // const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker"); // accounts[9].address
  // ReentrancyAttacker.connect(accounts[9]);
  // const reentrancyAttacker = await ReentrancyAttacker.deploy(reentrancyVictim.address);

  // await reentrancyAttacker.deployed();

  // console.log(`Deployed Attacker to ${reentrancyAttacker.address}`);

  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync(__dirname + '/../.env', "utf8").split(os.EOL);

  // find the env we want based on the key
  let x = ENV_VARS.find((line) => {
    return line.match(new RegExp('VICTIM_ADDRESS'));
  })

  let target = ENV_VARS.indexOf(x as string);

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `VICTIM_ADDRESS=\'${reentrancyVictim.address}\'`);

  //  // find the env we want based on the key
  // x= ENV_VARS.find((line) => {
  //   return line.match(new RegExp('ATTACKER_ADDRESS'));
  // })

  // target = ENV_VARS.indexOf(x as string);

  // // replace the key/value with the new value
  // ENV_VARS.splice(target, 1, `ATTACKER_ADDRESS=\'${reentrancyAttacker.address}\'`);

  // // write everything back to the file system
  // fs.writeFileSync(__dirname+"/../.env", ENV_VARS.join(os.EOL));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
