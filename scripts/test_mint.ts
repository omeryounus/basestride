import pkg from "hardhat";
const { ethers } = pkg;
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const STRIDE_SHOES_ADDRESS = '0xCDE8CFe4b2b6d0011cc04C0fa09A860e35ef9f0F';

async function main() {
    console.log("Attempting to mint a shoe...");

    const [owner] = await ethers.getSigners();
    const shoes = await ethers.getContractAt("StrideShoes", STRIDE_SHOES_ADDRESS);

    try {
        const tx = await shoes.mint(owner.address, 0); // Mint common shoe to owner
        console.log(`Mint transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log("Mint successful!");
    } catch (e: any) {
        console.error("Mint FAILED:", e.message);
    }
}

main().catch(console.error);
