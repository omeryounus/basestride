import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    console.log("Starting StrideShoes deployment to Base Sepolia...");

    const StrideShoes = await ethers.getContractFactory("StrideShoes");
    const shoes = await StrideShoes.deploy();
    await shoes.waitForDeployment();
    const shoesAddress = await shoes.getAddress();
    console.log(`StrideShoes deployed to: ${shoesAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
