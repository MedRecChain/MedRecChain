// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;
// const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
  /**
   * $ truffle test --network <network-name>
   */
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    // sepolia: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://eth-sepolia.g.alchemy.com/v2/${PROJECT_ID}`),
    //   network_id: "11155111",
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   gas: 4465030,
    //   skipDryRun: true
    // },

  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
  // },

  // $ truffle migrate --reset --compile-all
  //
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
