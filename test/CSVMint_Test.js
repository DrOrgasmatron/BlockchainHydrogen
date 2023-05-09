const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
//const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const fs = require('fs');
//const crypto = require('crypto');
const Machine1 = require("../scripts/Machine1");

const machine1 = new Machine1();

describe("CSVMint", function () {

    let hash;
    let globalCsvMint;

    async function deployCSVMintFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const CSVMint = await ethers.getContractFactory("CSVMint");
        const csvMint = await CSVMint.deploy();
        globalCsvMint = csvMint;
        return { csvMint, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should has the correct name and symbol", async function () {
            const { csvMint, owner } = await loadFixture(deployCSVMintFixture);
            const total = await csvMint.balanceOf(owner.address);
            expect(total).to.equal(0);
            expect(await csvMint.name()).to.equal('CSVMint');
            expect(await csvMint.symbol()).to.equal('CSV');

        });
    });

    describe("Create CSV and hash", function () {
        it("Should create a CSV file and hash it", async function () {
            hash = await machine1.run();
            expect(await hash).to.be.a('string');
        });
    });

    describe("Mint NFT", function () {
        it("Should mint a token with the hash of the csv file", async function () {
            await globalCsvMint.methods.mintCSV(hash).send({ from: accounts[0] });

            // Check that a new token was minted and assigned to the correct address
            const tokenId = 0; // Assuming the first token was minted
            const tokenOwner = await globalCsvMint.methods.ownerOf(tokenId).call();
            assert.equal(tokenOwner, accounts[0], "Token was not minted correctly");

            // Log success message
            console.log(`Token ${tokenId} minted for hash ${hash}`);

        });
    });
});