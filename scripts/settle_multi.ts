import pkg from "hardhat";
const { ethers } = pkg;
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REWARDS_CONTRACT_ADDRESS = '0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa';

async function main() {
    console.log("Setting roots for multiple epochs...");

    const root = '0x8ccf2e3291b778101f893d3fa12e1c6736a3f922e8b4dcdf672dfc62a3e49f15';
    const distributor = await ethers.getContractAt("StrideRewardsDistributor", REWARDS_CONTRACT_ADDRESS);

    for (let epoch of [0, 1, 2]) {
        console.log(`Setting root for epoch ${epoch}...`);
        const tx = await distributor.setMerkleRoot(epoch, root);
        await tx.wait();
        console.log(`Epoch ${epoch} set. TX: ${tx.hash}`);
    }

    console.log("All roots synchronized.");
}

main().catch(console.error);
