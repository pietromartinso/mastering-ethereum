import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ReentrancyAttackerOnProtectedVictim", function () {

  async function deployOneYearLockFixture() {

    const [victimOwnerAcc, acc1, acc2, attackerOwnerAcc] = await ethers.getSigners();

    const ReentrancyProtectedVictim = await ethers.getContractFactory("ReentrancyProtectedVictim");
    const reentrancyProtectedVictim = await ReentrancyProtectedVictim.deploy();

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

  describe("Deposits", async () => {
    it("Should be possible to deposit and increase contract's balance correctly", async function () {
      const { reentrancyProtectedVictim, acc1 } = await loadFixture(deployOneYearLockFixture);

      await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "2000000000000000000"});

      const balance = await ethers.provider.getBalance(reentrancyProtectedVictim.address);

      expect(ethers.BigNumber.from(balance)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    });

    it("Should be possible to deposit and increase accounts's balance correctly inside the contract", async function () {
      const { reentrancyProtectedVictim, acc1 } = await loadFixture(deployOneYearLockFixture);

      await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

      await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

      const balance = await reentrancyProtectedVictim.connect(acc1).balances(acc1.address);

      expect(ethers.BigNumber.from(balance)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    });
  });

  describe("Withdrawalls", async () => {
    it("Shouldn't be possible to withdraw if user balances aren't ok", async function () {
      const { reentrancyProtectedVictim, acc1 } = await loadFixture(deployOneYearLockFixture);
      
      await expect(reentrancyProtectedVictim.connect(acc1).withdrawFunds())
        .to.be.revertedWith("The msg.sender doesn\'t have enough balance");
    });

    it("Should be possible to withdraw, if user has balance ok", async function () {
      const { reentrancyProtectedVictim, acc1 } = await loadFixture(deployOneYearLockFixture);

      const balanceBefore = await ethers.provider.getBalance(acc1.address);

      const depositResponse = await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});
      const depositResult = await depositResponse.wait();

      const withdrawResponse = await reentrancyProtectedVictim.connect(acc1).withdrawFunds();
      const withdrawResult = await withdrawResponse.wait();

      const depositGasConsumedInWei = ethers.BigNumber.from(depositResult.gasUsed).mul(ethers.BigNumber.from(depositResult.effectiveGasPrice));
      const withdrawGasConsumedInWei = ethers.BigNumber.from(withdrawResult.gasUsed).mul(ethers.BigNumber.from(withdrawResult.effectiveGasPrice));
      const totalGasConsumedInWei = depositGasConsumedInWei.add(withdrawGasConsumedInWei);

      const balanceAfter = await ethers.provider.getBalance(acc1.address);

      expect(ethers.BigNumber.from(balanceBefore)).to.equal(ethers.BigNumber.from(balanceAfter).add(totalGasConsumedInWei));
    });

    it("The user balance inside the contract should be zero after a withdraw", async function () {
      const { reentrancyProtectedVictim, acc1 } = await loadFixture(deployOneYearLockFixture);

      await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

      reentrancyProtectedVictim.connect(acc1).withdrawFunds();

      const balance = await reentrancyProtectedVictim.connect(acc1).balances(acc1.address);

      expect(ethers.BigNumber.from(balance)).to.equal(ethers.BigNumber.from("0"));
    });
  });

  describe("Attack & Steal Flow", async () => {
    it("Should not be possible to attack and steal ", async function () {
      const { reentrancyAttacker, reentrancyProtectedVictim, victimOwnerAcc, acc1, acc2, attackerOwnerAcc } = await loadFixture(deployOneYearLockFixture);

      await reentrancyProtectedVictim.connect(victimOwnerAcc).depositFunds({value: "1000000000000000000"});

      await reentrancyProtectedVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

      await reentrancyProtectedVictim.connect(acc2).depositFunds({value: "1000000000000000000"});

      await expect(reentrancyAttacker.connect(attackerOwnerAcc).attackEtherStore({value: "1000000000000000000"}))
        .to.be.revertedWith("Failed to send Ether");
    });
  });
});