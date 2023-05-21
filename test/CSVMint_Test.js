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
    let csvMint, owner, otherAccount;

    async function deployCSVMintFixture() {
        // Contracts are deployed using the first signer/account by default
        //const [owner, otherAccount] = await ethers.getSigners();
        [owner, otherAccount] = await ethers.getSigners();

        const CSVMint = await ethers.getContractFactory("CSVMint");
        //const csvMint = await CSVMint.deploy();
        csvMint = await CSVMint.deploy();
        /*
        globalCsvMint = csvMint;
        return { csvMint, owner, otherAccount };
        */
        const fixtureInstance = { csvMint, owner, otherAccount };
        return fixtureInstance;
    }

    describe("Deployment", function () {
        it("Should has the correct name and symbol", async function () {
            const { csvMint, owner } = await loadFixture(deployCSVMintFixture);
            const total = await csvMint.balanceOf(owner.address);
            expect(total).to.equal(0);
            expect(await csvMint.name()).to.equal('CSVMint');
            expect(await csvMint.symbol()).to.equal('CSV');
            //console.log(await csvMint.address);

        });
    });

    describe("Create CSV and hash", function () {
        it("Should create a CSV file and hash it", async function () {
            hash = await machine1.run();
            expect(await hash).to.be.a('string');
            console.log(`Hash: ${hash}`);
        });
    });

    describe("Mint NFT", function () {
        it("Should mint a token with the hash of the csv file", async function () {
            // const { csvMint, owner } = await loadFixture(deployCSVMintFixture);

            await csvMint.mintCSV(machine1.run(), machine1.readableDate());

            // Check that a new token was minted and assigned to the correct address
            const tokenId = 0; // Assuming the first token was minted
            const tokenOwner = await csvMint.ownerOf(tokenId);
            expect(tokenOwner).to.equal(owner.address, "Token was not minted correctly");

            // Log success message
            console.log(`Token ${tokenId} minted for hash ${hash}`);



        });
    });

    describe("Check CSV Token", function () {
        it("Should check the csv hash with the token hash", async function () {
            //const { csvMint, owner } = await loadFixture(deployCSVMintFixture);

            console.log(await csvMint.getAllCSVToken());

            expect(await csvMint.checkCSVToken(hash)).to.be.true;


        });
    });
});