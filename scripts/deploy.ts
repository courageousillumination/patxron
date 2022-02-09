// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Patxreon = await hre.ethers.getContractFactory("Patxreon");
  const patxreon = await Patxreon.deploy();

  await patxreon.deployed();

  console.log("Patxreon deployed to:", patxreon.address);

  // Seed some initial subscriptions
  const [_, bob] = await hre.ethers.getSigners();
  await patxreon.createSubscription(
    bob.address,
    1000000000000,
    60 * 60 * 24 * 7, // 1 week
    { value: 1000000000000 }
  );

  console.log("Initialized with sample data.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
