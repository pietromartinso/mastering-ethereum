import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ReentrancyAttacker", function () {

  async function deployOneYearLockFixture() {

    const [victimOwnerAcc, acc1, acc2, attackerOwnerAcc] = await ethers.getSigners();

    const ReentrancyVictim = await ethers.getContractFactory("ReentrancyVictim");
    const reentrancyVictim = await ReentrancyVictim.deploy();

    await reentrancyVictim.connect(victimOwnerAcc).depositFunds({value: "1000000000000000000"});

    await reentrancyVictim.connect(acc1).depositFunds({value: "1000000000000000000"});

    await reentrancyVictim.connect(acc2).depositFunds({value: "1000000000000000000"});

    const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
    const reentrancyAttacker = await ReentrancyAttacker.connect(attackerOwnerAcc).deploy(reentrancyVictim.address);

    return { reentrancyAttacker, reentrancyVictim, victimOwnerAcc, acc1, acc2, attackerOwnerAcc };
  }

  describe("Deployment", async () => {
    it("Should deploy properly with balance equal zero", async function () {
      const { reentrancyAttacker } = await loadFixture(deployOneYearLockFixture);

      const balance = await ethers.provider.getBalance(reentrancyAttacker.address);

      expect(ethers.BigNumber.from(balance)).to.equal(ethers.BigNumber.from("0"));
    });
  });

  describe("Attack & Steal Flow", async () => {
    it("Should be possible to attack and steal ", async function () {
      const { reentrancyAttacker, reentrancyVictim, attackerOwnerAcc } = await loadFixture(deployOneYearLockFixture);

      const attackerInput = "1000000000000000000";

      const victimBalanceBefore = ethers.BigNumber.from(await ethers.provider.getBalance(reentrancyVictim.address)).add(ethers.BigNumber.from(attackerInput));

      const attackResponse = await reentrancyAttacker.connect(attackerOwnerAcc).attackEtherStore({value: attackerInput});
      await attackResponse.wait();

      const attackerBalanceAfter = await ethers.provider.getBalance(reentrancyAttacker.address);

      expect(ethers.BigNumber.from(victimBalanceBefore)).to.equal(ethers.BigNumber.from(attackerBalanceAfter));
    });

    it("Should not be possible attack without sending the right amount of ether", async function () {
      const { reentrancyAttacker, attackerOwnerAcc } = await loadFixture(deployOneYearLockFixture);

      await expect(reentrancyAttacker.connect(attackerOwnerAcc).attackEtherStore())
        .to.be.revertedWith("Attacker msg.value < 1 ether");
    });
  });

  describe("Withdraw Stolen Ether", async () => {
    it("Shouldn't be possible to withdraw if user balances aren't ok", async function () {
      const { reentrancyAttacker, attackerOwnerAcc } = await loadFixture(deployOneYearLockFixture);

      const attackResponse = await reentrancyAttacker.connect(attackerOwnerAcc).attackEtherStore({value: "1000000000000000000"});
      await attackResponse.wait();

      const attackerBalanceBefore = ethers.BigNumber.from(await ethers.provider.getBalance(reentrancyAttacker.address));
      const attackerEOABalanceBefore = ethers.BigNumber.from(await ethers.provider.getBalance(attackerOwnerAcc.address));

      const collectResponse = await reentrancyAttacker.connect(attackerOwnerAcc).collectEther();
      const collectResult = await collectResponse.wait();

      const collectGasConsumedInWei = ethers.BigNumber.from(collectResult.gasUsed).mul(ethers.BigNumber.from(collectResult.effectiveGasPrice));

      const attackerEOABalanceAfter = await ethers.provider.getBalance(attackerOwnerAcc.address);

      const balanceDifference = attackerEOABalanceAfter.add(collectGasConsumedInWei).sub(attackerEOABalanceBefore);

      expect(ethers.BigNumber.from(attackerBalanceBefore)).to.equal(ethers.BigNumber.from(balanceDifference));
    });
  });
});
