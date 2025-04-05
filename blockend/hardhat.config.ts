import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
require("dotenv").config();

const config: HardhatUserConfig = {
  defaultNetwork: "arbitrum",

  networks: {
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    polygon: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },

  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;
