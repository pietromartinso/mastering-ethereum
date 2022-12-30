import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ReentrancyAttackerOnProtectedVictim", function () {

  async function deployOneYearLockFixture() {

    const [victimOwnerAcc, acc1, acc2, attackerOwnerAcc] = await ethers.getSigners();

    const ReentrancyProtectedVictim = await ethers.getContractFactory("ReentrancyProtectedVictim");
    const reentrancyProtectedVictim = await ReentrancyProtectedVictim.deploy();

    await reentrancyProtectedVictim.connect(victimOwnerAcc).depositFunds({value: "1000000000000000000"});

    await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

    await reentrancyProtectedVictim.connect(acc2).depositFunds({value: "1000000000000000000"});

    const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
    const reentrancyAttacker = await ReentrancyAttacker.connect(attackerOwnerAcc).deploy(reentrancyProtectedVictim.address);

    return { reentrancyAttacker, reentrancyProtectedVictim, victimOwnerAcc, acc1, acc2, attackerOwnerAcc };
  }

  describe("Deployment", async () => {
    it("Should deploy properly with balance equal zero", async function () {
      const { reentrancyAttacker } = await loadFixture(deployOneYearLockFixture);

      const balance = await ethers.provider.getBalance(reentrancyAttacker.address);

      expect(ethers.BigNumber.from(balance)).to.equal(ethers.BigNumber.from("0"));
    });
  });

  describe("Attack & Steal Flow", async () => {
    it("Should not be possible to attack and steal ", async function () {
      const { reentrancyAttacker, attackerOwnerAcc } = await loadFixture(deployOneYearLockFixture);

      await expect(reentrancyAttacker.connect(attackerOwnerAcc).attackEtherStore({value: "1000000000000000000"}))
        .to.be.revertedWith("Withdraw reentrant call atempt");
    });
  });
});