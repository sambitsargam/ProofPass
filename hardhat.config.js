import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    mocaTestnet: {
      type: "http",
      url: "https://testnet-rpc.mocachain.org/",
      chainId: 222888,
      accounts: [process.env.MOCA_PRIVATE_KEY || ""],
    },
  },
};



