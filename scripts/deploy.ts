import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    console.log("Starting deployment to Base Sepolia...");

    // 1. Deploy StrideToken
    const StrideToken = await ethers.getContractFactory("StrideToken");
    const token = await StrideToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`StrideToken deployed to: ${tokenAddress}`);

    // 2. Deploy StrideRewardsDistributor
    const StrideRewardsDistributor = await ethers.getContractFactory("StrideRewardsDistributor");
    const distributor = await StrideRewardsDistributor.deploy(tokenAddress);
    await distributor.waitForDeployment();
    const distributorAddress = await distributor.getAddress();
    console.log(`StrideRewardsDistributor deployed to: ${distributorAddress}`);

    // 3. Deploy StrideShoes
    const StrideShoes = await ethers.getContractFactory("StrideShoes");
    const shoes = await StrideShoes.deploy();
    await shoes.waitForDeployment();
    const shoesAddress = await shoes.getAddress();
    console.log(`StrideShoes deployed to: ${shoesAddress}`);

    console.log("\nDeployment complete!");
    console.log("-------------------");
    console.log(`NEXT_PUBLIC_STRIDE_TOKEN_ADDRESS=${tokenAddress}`);
    console.log(`NEXT_PUBLIC_REWARDS_DISTRIBUTOR_ADDRESS=${distributorAddress}`);
    console.log(`NEXT_PUBLIC_STRIDE_SHOES_ADDRESS=${shoesAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
