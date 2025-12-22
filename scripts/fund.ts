import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const TOKEN_ADDRESS = "0xe5559e464FBF6Ea027E6C4821aFAB40a7390Aca8";
    const DISTRIBUTOR_ADDRESS = "0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa";

    console.log(`Funding Distributor ${DISTRIBUTOR_ADDRESS} with tokens from ${TOKEN_ADDRESS}...`);

    const StrideToken = await ethers.getContractAt("StrideToken", TOKEN_ADDRESS);

    const [deployer] = await ethers.getSigners();
    console.log(`Using deployer address: ${deployer.address}`);

    const deployerBalanceBefore = await StrideToken.balanceOf(deployer.address);
    console.log(`Deployer balance: ${ethers.formatEther(deployerBalanceBefore)} STRIDE`);

    const distributorBalanceBefore = await StrideToken.balanceOf(DISTRIBUTOR_ADDRESS);
    console.log(`Distributor balance before: ${ethers.formatEther(distributorBalanceBefore)} STRIDE`);

    // Fund with 10 million tokens (10,000,000 * 10^18)
    const amountToFund = ethers.parseEther("10000000");

    if (deployerBalanceBefore < amountToFund) {
        throw new Error("Deployer doesn't have enough tokens!");
    }

    console.log(`Transferring ${ethers.formatEther(amountToFund)} STRIDE...`);
    const tx = await StrideToken.transfer(DISTRIBUTOR_ADDRESS, amountToFund);
    await tx.wait();

    console.log("Transfer complete!");

    const balance = await StrideToken.balanceOf(DISTRIBUTOR_ADDRESS);
    console.log(`Distributor balance: ${ethers.formatEther(balance)} STRIDE`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
