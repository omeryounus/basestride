import pkg from "hardhat";
const { ethers } = pkg;
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REWARDS_CONTRACT_ADDRESS = '0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa';
const STRIDE_SHOES_ADDRESS = '0xCDE8CFe4b2b6d0011cc04C0fa09A860e35ef9f0F';

async function main() {
    console.log("Deep checking contracts...");

    const rewards = await ethers.getContractAt("StrideRewardsDistributor", REWARDS_CONTRACT_ADDRESS);
    const shoes = await ethers.getContractAt("StrideShoes", STRIDE_SHOES_ADDRESS);

    try {
        const root1 = await rewards.merkleRoots(1);
        console.log(`Rewards Contract Root(1): ${root1}`);
    } catch (e) {
        console.log(`Rewards Contract does NOT have merkleRoots function`);
    }

    try {
        // Checking if Shoes contract accidentally responds to merkleRoots(1)
        const data = await ethers.provider.call({
            to: STRIDE_SHOES_ADDRESS,
            data: rewards.interface.encodeFunctionData("merkleRoots", [1])
        });
        console.log(`Shoes Contract response to merkleRoots(1): ${data}`);
    } catch (e) {
        console.log(`Shoes Contract does NOT respond to merkleRoots(1)`);
    }
}

main().catch(console.error);
