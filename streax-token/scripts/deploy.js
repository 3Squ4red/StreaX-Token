const hre = require("hardhat");

async function main() {
  const StreaXToken = await hre.ethers.getContractFactory("StreaXToken");
  const streaXToken = await StreaXToken.deploy();

  await streaXToken.deployed();

  console.log(`StreaXToken deployed to ${streaXToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
