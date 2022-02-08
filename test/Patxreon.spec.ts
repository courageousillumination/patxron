import { Provider } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, waffle } from "hardhat";

const SUBSCRIPTION_AMOUNT = 100000;
const SUBSCRIPTION_INTERVAL = 1000;

describe("Patxreon", () => {
  let patxreon: Contract;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let provider: Provider;

  beforeEach(async () => {
    // Get all of the signers we care about.
    const signers = await ethers.getSigners();
    alice = signers[0];
    bob = signers[1];

    // Create the contract factory.
    // NOTE: This is bound to bob. Any transactions will be carried out
    // by Bob, so keep that in mind.
    const Patxreon = await ethers.getContractFactory("Patxreon", bob);
    patxreon = await Patxreon.deploy();
    await patxreon.deployed();

    // Attach the provider so we can check balances.
    provider = waffle.provider;
  });

  const createSubscription = (value?: number) => {
    return patxreon.createSubscription(
      alice.address,
      SUBSCRIPTION_AMOUNT,
      SUBSCRIPTION_INTERVAL,
      { value }
    );
  };

  describe("simple subscriptions", () => {
    describe("create subscription", () => {
      it("creates a subscription and funds the contract", async () => {
        await createSubscription(SUBSCRIPTION_AMOUNT);
        expect(await provider.getBalance(patxreon.address)).to.eq(
          SUBSCRIPTION_AMOUNT
        );
      });

      it("ensures the value will cover the subscription", async () => {
        await expect(createSubscription()).to.be.reverted;
      });

      it("can not make two subscriptions from the same account", async () => {
        await createSubscription(SUBSCRIPTION_AMOUNT);
        await expect(createSubscription(SUBSCRIPTION_AMOUNT)).to.be.reverted;
      });
    });

    describe("cancel subscription", () => {
      it("cancels an existing subscription", async () => {
        await createSubscription(SUBSCRIPTION_AMOUNT);
        await patxreon.cancelSubscription(alice.address, bob.address);
        // We should have been refunded our value and the contract should be empty.
        expect(await provider.getBalance(patxreon.address)).to.eq(0);
      });
    });

    describe("claimFunds", () => {
      let initialBalance: BigNumber;

      const expectBalanceChange = async (amount: number) => {
        const newBalance = await alice.getBalance();
        const target = initialBalance.add(amount);
        expect(newBalance).to.equal(target);
      };

      beforeEach(async () => {
        initialBalance = await alice.getBalance();
      });

      describe("with one interval of funding", () => {
        beforeEach(async () => {
          await createSubscription(SUBSCRIPTION_AMOUNT);
        });

        it("properly withdraws funds", async () => {
          await patxreon.claimFunds(alice.address);
          await expectBalanceChange(SUBSCRIPTION_AMOUNT);
        });

        it("does not allow withdrawing more than the funding", async () => {
          // Claim one round of funding.
          await patxreon.claimFunds(alice.address);
          // The subscription should be exhausted now, so we don't get any
          // extra money, even if we wait the appropriate amount of time.
          await ethers.provider.send("evm_increaseTime", [
            SUBSCRIPTION_INTERVAL,
          ]);
          await patxreon.claimFunds(alice.address);
          await expectBalanceChange(SUBSCRIPTION_AMOUNT);
        });
      });

      describe("with multiple intervals of funding", () => {
        beforeEach(async () => {
          await createSubscription(SUBSCRIPTION_AMOUNT * 2);
        });

        it("requires waiting for the timer to elapse", async () => {
          await patxreon.claimFunds(alice.address);
          // This is running too soon
          await patxreon.claimFunds(alice.address);

          await expectBalanceChange(SUBSCRIPTION_AMOUNT);

          await ethers.provider.send("evm_increaseTime", [
            SUBSCRIPTION_INTERVAL,
          ]);
          await patxreon.claimFunds(alice.address);
          await expectBalanceChange(SUBSCRIPTION_AMOUNT * 2);
        });
      });
    });
  });
});
