import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        "base-sepolia": {
            url: BASE_SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
};

export default config;
