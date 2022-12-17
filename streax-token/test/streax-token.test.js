const { expect } = require("chai");


describe("streaxToken contract", function () {
  // global vars
  let streaxToken;
  let creator, addr1, addr2;
  // Helper functions
  const toWei = (eth) => ethers.utils.parseEther(eth);
  const toEth = (wei) => ethers.utils.formatEther(wei);

  beforeEach(async function () {
    // Get the StreaX and Signers here.
    [creator, addr1, addr2] = await hre.ethers.getSigners();

    const Token = await ethers.getContractFactory("StreaXToken");
    streaxToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right creator", async function () {
      expect(await streaxToken.creator()).to.equal(creator.address);
    });

    it("Should assign the total supply (70_000_000) of tokens to the creator", async function () {
      const creatorBalance = await streaxToken.balanceOf(creator.address);
      expect(await streaxToken.totalSupply()).to.equal(creatorBalance);
    });

    it("Should set the max capped supply to 100_000_000", async function () {
      const cap = await streaxToken.cap();
      expect(Number(toEth(cap))).to.equal(100_000_000);
    });

    it("Should set the blockReward to 50", async function () {
      const blockReward = await streaxToken.blockReward();
      expect(Number(toEth(blockReward))).to.equal(50);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from creator to addr1
      await streaxToken.transfer(addr1.address, toWei("50"));
      const addr1Balance = await streaxToken.balanceOf(addr1.address);
      expect(Math.trunc(toEth(addr1Balance))).to.equal(50.0);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await streaxToken.connect(addr1).transfer(addr2.address, toWei("50"));
      const addr2Balance = await streaxToken.balanceOf(addr2.address);
      expect(Math.trunc(toEth(addr2Balance))).to.equal(
        50.0 // test .0
      );
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialcreatorBalance = await streaxToken.balanceOf(
        creator.address
      );
      // Try to send 1 token from addr1 (0 tokens) to creator.
      // `require` will evaluate false and revert the transaction.
      await expect(
        streaxToken.connect(addr1).transfer(creator.address, toWei("1"))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // creator balance shouldn't have changed.
      expect(await streaxToken.balanceOf(creator.address)).to.equal(
        initialcreatorBalance
      );
    });

    it("Should update balances after transfers", async function () {
      // Transfer 100 tokens from creator to addr1.
      await expect(
        streaxToken.transfer(addr1.address, 100)
      ).to.changeTokenBalances(
        streaxToken,
        [creator.address, addr1.address],
        [-100, 100]
      );

      // Transfer another 50 tokens from creator to addr2.
      await expect(
        streaxToken.transfer(addr2.address, 50)
      ).to.changeTokenBalances(
        streaxToken,
        [creator.address, addr2.address],
        [-50, 50]
      );
    });
  });
});
