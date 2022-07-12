const { expect } = require('chai');

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe('NFT Marketplace', function () {
  let NFT;
  let Marketplace;
  let deployer;
  let acc1;
  let acc2;
  let marketplace;
  let nft;
  let feePercent = 1;
  let URI = 'HAHA';

  beforeEach(async function () {
    NFT = await ethers.getContractFactory('NFT');
    Marketplace = await ethers.getContractFactory('Marketplace');

    [deployer, acc1, acc2] = await ethers.getSigners();

    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe('Deployment', function () {
    it('Should have the correct name and Symbol', async function () {
      expect(await nft.name()).to.equal('MyNFT');
      expect(await nft.symbol()).to.equal('MFT');
    });

    it('Should have the correct fee percent', async function () {
      expect(await marketplace.feePercent()).to.equal(1);
      expect(await marketplace.feeReceiver()).to.equal(deployer.address);
    });
  });

  describe('Mint NFTs', function () {
    it('Should be able to mint NFTs', async function () {
      await nft.connect(acc1).mint(URI);
      expect(await nft.connect(acc1).balanceOf(acc1.address)).to.equal(1);
      await nft.connect(acc2).mint(URI);
      expect(await nft.connect(acc1).tokenCount()).to.equal(2);
    });
  });

  describe('Listing Items in the Marketplace', function () {
    beforeEach(async function () {
      await nft.connect(acc1).mint(URI);
      await nft.connect(acc1).setApprovalForAll(marketplace.address, true);
    });

    it('Should be able to list an item', async function () {
      await expect(marketplace.connect(acc1).listItem(nft.address, 1, toWei(1)))
        .to.emit(marketplace, 'Listed')
        .withArgs(1, nft.address, 1, toWei(1), acc1.address);

      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
    });

    it('Should revert with error that price is 0', async function () {
      await expect(
        marketplace.connect(acc1).listItem(nft.address, 1, 0)
      ).to.be.revertedWith('Price is less than or equal to 0');
    });
  });
});
