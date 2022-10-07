import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import dotenv from 'dotenv';

const POLYGON: any = process.env.POLYGON

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  defaultNetwork: 'localhost',
  networks: {
    localhost: {},
    forkingMainnet: {
      allowUnlimitedContractSize: true,
      url: 'http://127.0.0.1:8545',
      forking: {
        url: POLYGON,
        blockNumber: 15346956,
        enabled: true,
      },
    },
  }
};

export default config;
