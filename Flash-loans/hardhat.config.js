require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {},
    forkingMainnet: {
      url: 'http://127.0.0.1:8545',
      forking: {
        url: 'https://mainnet.aurora.dev',
        // blockNumber: 15600759
      }
    },
    // aurora: {
    //   url: `https://mainnet.aurora.dev`,
    //   accounts: [process.env.privateKey],
    // },
    // fantom: {
    //   url: `https://rpc.ftm.tools/`,
    //   accounts: [process.env.privateKey],
    // },
  },
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.7.0" },
      { version: "0.6.6" }
    ]
  },
};
