// scripts/deploy.js

const hre2 = require("hardhat");

async function main1() {
  // We get the contract to deploy.
  const BuyMeACoffee = await hre2.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deployed();

  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address, buyMeACoffee.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main1()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });