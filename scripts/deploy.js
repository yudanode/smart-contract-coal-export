const hre = require("hardhat");

async function main() {
  const CoalPriceRegistry = await hre.ethers.getContractFactory("CoalPriceRegistry");
  const contract = await CoalPriceRegistry.deploy();
  await contract.waitForDeployment();
  console.log("CoalPriceRegistry deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});