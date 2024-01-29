import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT", async function () {
  const name = "LOL";
  const symbol = "LOL"

  async function deployMyNFT() {
    const [owner, otherAccount] = await ethers.getSigners();
    const MyContract = await ethers.getContractFactory("MyNFT")
    const myNFT = await MyContract.deploy(name, symbol);
    return {
      myNFT: myNFT, owner, otherAccount
    }
  }
  
  describe("Deployment", function () {
    it("Should set the rigth token name and symbol", async () => {
      const { myNFT, owner, otherAccount } = await loadFixture(deployMyNFT)      
      const mySymbol = await myNFT.symbol()
      expect(mySymbol).to.equal(symbol);

      const myName = await myNFT.name();
      expect(myName).to.equal(name);
    })
  });

  describe('Mint MyNFT', () => {
    it("The address should equal to reciept address", async () => {
      const { myNFT, owner, otherAccount } = await loadFixture(deployMyNFT)
      const address = otherAccount.address
      let tokenId = 1
      // mint one NFT to address
      await myNFT.mintTo(address)
      expect(await myNFT.ownerOf(tokenId)).to.equal(address);

      // Incremental token ids should be equal
      await myNFT.mintTo(address)
      tokenId += 1;
      expect(await myNFT.ownerOf(tokenId)).to.equal(address);
      
      expect(await myNFT.balanceOf(address)).to.equal(2);
    })
  })
});
