import pkg from "hardhat";
const { ethers } = pkg;
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REWARDS_CONTRACT_ADDRESS = '0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa';
const STRIDE_SHOES_ADDRESS = '0xCDE8CFe4b2b6d0011cc04C0fa09A860e35ef9f0F';

async function main() {
    console.log("Checking contract addresses...");

    try {
        const shoes = await ethers.getContractAt("StrideShoes", STRIDE_SHOES_ADDRESS);
        const name = await shoes.name();
        console.log(`Address ${STRIDE_SHOES_ADDRESS} is: ${name}`);
    } catch (e) {
        console.log(`Address ${STRIDE_SHOES_ADDRESS} is NOT StrideShoes (or error)`);
    }

    try {
        const rewards = await ethers.getContractAt("StrideRewardsDistributor", REWARDS_CONTRACT_ADDRESS);
        const token = await rewards.strideToken();
        console.log(`Address ${REWARDS_CONTRACT_ADDRESS} is StrideRewardsDistributor (Token: ${token})`);
    } catch (e) {
        console.log(`Address ${REWARDS_CONTRACT_ADDRESS} is NOT StrideRewardsDistributor (or error)`);
    }
}

main().catch(console.error);
