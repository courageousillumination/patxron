import { expect } from "chai";
import { ethers } from "hardhat";

describe("Patxreon", function () {
  it("should allow claiming a subscription", async function () {
    // Create and deploy the patxreon contract.
    const [alice, bob] = await ethers.getSigners();
    const Patxreon = await ethers.getContractFactory("Patxreon", bob);
    const patxreon = await Patxreon.deploy();
    await patxreon.deployed();

    // Get the initial balance so we know what to compare against.
    const initialBalance = await alice.getBalance();

    // Create a new subscription and then claim the funds.
    await patxreon.createSubscription(alice.address, 1000000, 0, {
      value: 1000000,
    });
    await patxreon.claimFunds(alice.address);

    // Make sure we were able to grab the associated amount.
    // NOTE: We have to be careful that Alice is not making any transactions
    // so she doesn't lose balance due to gas. Bob is quite the generous patron.
    expect(await alice.getBalance()).to.equal(initialBalance.add(1000000));
  });
});
