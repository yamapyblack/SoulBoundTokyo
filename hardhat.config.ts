import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkAccountsConfig } from "hardhat/types"

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-etherscan";

const accounts = (): HttpNetworkAccountsConfig => {
  if (!process.env.PRIV_KEY) {
    return "remote"
  }
  return [process.env.PRIV_KEY!]
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 4,
      gasPrice: 1000000001,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 1,
      gas: "auto",
      gasPrice: 45000000000,
      // accounts: accounts(),
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }  
      },
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 80000
  },
  gasReporter: {
    currency: 'ETH',
    gasPrice: 1000000001,
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  },
};

export default config;
