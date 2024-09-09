export const CHAINS = {
  11155111: {
    id: 11155111,
    name: "Ethereum Sepolia",
    network: "sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
    type: "testnet",
    parentChain: "Ethereum",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
    swap: {
      pancake: {
        routerContractAddress: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
        swapTokens: [],
      },
    },
  },
  80002: {
    id: 80002,
    name: "Polygon Amoy",
    network: "polygonAmoy",
    nativeCurrency: {
      decimals: 18,
      name: "MATIC",
      symbol: "MATIC",
    },
    rpc: "https://rpc-amoy.polygon.technology",
    explorer: "https://amoy.polygonscan.com",
    type: "testnet",
    parentChain: "Polygon",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
    swap: {},
  },
  31337: {
    id: 31337,
    name: "DevNet",
    network: "hardhat",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "http://localhost:8545",
    explorer: "",
    type: "devnet",
    parentChain: "Hardhat",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
    swap: {},
  },
  5: {
    id: 5,
    name: "Goerli",
    network: "goerli",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "https://rpc.ankr.com/eth_goerli",
    explorer: "https://goerli.etherscan.io",
    type: "testnet",
    parentChain: "Ethereum",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
    swap: {},
  },
  1313161555: {
    id: 1313161555,
    name: "Aurora Testnet",
    network: "auroraTestnet",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "https://testnet.aurora.dev",
    explorer: "https://explorer.testnet.aurora.dev",
    type: "testnet",
    parentChain: "Aurora",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/20582/standard/aurora.jpeg?1696519989",
    swap: {},
  },
  59141: {
    id: 59141,
    name: "Linea Sepolia Testnet",
    network: "lineaSepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "https://linea-sepolia.blockpi.network/v1/rpc/public",
    explorer: "https://explorer.sepolia.linea.build",
    type: "testnet",
    parentChain: "Linea",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/asset_platforms/images/135/small/linea.jpeg?1706606705",
    swap: {},
  },
  84532: {
    id: 84532,
    name: "Base Sepolia",
    network: "baseSepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    type: "testnet",
    parentChain: "Base",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png?1720533039",
    swap: {
      pancake: {
        routerContractAddress: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
        swapTokens: [],
      },
    },
  },
  80084: {
    id: 80084,
    name: "Berachain bArtio",
    network: "berachainTestnetbArtio",
    nativeCurrency: {
      decimals: 18,
      name: "BERA",
      symbol: "BERA",
    },
    rpc: "https://bartio.rpc.berachain.com",
    explorer: "https://bartio.beratrail.io",
    type: "testnet",
    parentChain: "Berachain",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/25238/standard/n2QLtggX_400x400.png?1696524379",
    swap: {},
  },
  1287: {
    id: 1287,
    name: "Moonbase Alpha",
    network: "moonbaseAlpha",
    nativeCurrency: {
      decimals: 18,
      name: "DEV",
      symbol: "DEV",
    },
    rpc: "https://rpc.api.moonbase.moonbeam.network",
    explorer: "https://moonbase.moonscan.io",
    type: "testnet",
    parentChain: "Moonbeam",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/31867/standard/moon-logo-200x200.png?1696530679",
  },
  5611: {
    id: 5611,
    name: "BNB Optimistic Rollup Testnet",
    network: "opBNBTestnet",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpc: "https://opbnb-testnet-rpc.bnbchain.org",
    explorer: "https://testnet.opbnbscan.com",
    type: "testnet",
    parentChain: "BNB",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970",
    swap: {
      pancake: {
        routerContractAddress: "0x62FF25CFD64E55673168c3656f4902bD7Aa5F0f4",
        swapTokens: [
          {
            name: "BNB",
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
          },
          {
            name: "USDC",
            address: "0x845E27B8A4ad1Fe3dc0b41b900dC8C1Bb45141C3",
            decimals: 6,
          },
          {
            name: "USDT",
            address: "0xCF712f20c85421d00EAa1B6F6545AaEEb4492B75",
            decimals: 6,
          },
        ],
      },
    },
  },
  97: {
    id: 97,
    name: "Binance Smart Chain Testnet",
    network: "bscTestnet",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpc: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    explorer: "https://testnet.bscscan.com",
    type: "testnet",
    parentChain: "BNB",
    chainFamily: "evm",
    logoUrl:
      "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970",
    swap: {
      pancake: {
        routerContractAddress: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        swapTokens: [],
      },
    },
  },
};
