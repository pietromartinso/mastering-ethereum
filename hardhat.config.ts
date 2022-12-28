import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

var PKs_list = [process.env.PK_1, process.env.PK_2, process.env.PK_3];

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    goerli: {
      url: process.env.INFURA_URL,
      accounts: PKs_list as []
    }
  }
};

export default config;
