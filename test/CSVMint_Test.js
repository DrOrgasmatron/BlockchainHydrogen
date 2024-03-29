const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const fs = require('fs');
const path = require('path');
const Machine1 = require("../scripts/Machine1");
const CreateCertificate = require("../scripts/CreateCertificate");


const machine1 = new Machine1();

describe("Contracts Tests", function () {

    let hash;
    let certifHash;
    let globalCsvMint;
    let globalCertifMint;
    let csvMint, owner, otherAccount;
    let certifMint, certifOwner, certifOtherAccount;

    //CSVMint
    async function deployCSVMintFixture() {
        // Contracts are deployed using the first signer/account by default
        [owner, otherAccount] = await ethers.getSigners();
        console.log("Owner: ", owner.address);
        const CSVMint = await ethers.getContractFactory("CSVMint");
        csvMint = await CSVMint.deploy(owner.address, owner.address, owner.address);

        const fixtureInstance = { csvMint, owner, otherAccount };
        return fixtureInstance;
    }
    //CertifMint
    async function deployCertifMintFixture() {
        // Contracts are deployed using the first signer/account by default
        [certifOwner, certifOtherAccount] = await ethers.getSigners();
        console.log("CertifOwner: ", certifOwner.address);
        const CertifMint = await ethers.getContractFactory("CertificateMint");
        certifMint = await CertifMint.deploy(certifOwner.address, certifOwner.address, certifOwner.address);

        const fixtureInstance = { certifMint, certifOwner, certifOtherAccount };
        return fixtureInstance;
    }

    describe("Deployment", function () {
        it("Should have the correct names and symbols", async function () {
            const { csvMint, owner } = await loadFixture(deployCSVMintFixture);
            const total = await csvMint.balanceOf(owner.address);
            expect(total).to.equal(0);
            expect(await csvMint.name()).to.equal('CSVMint');
            expect(await csvMint.symbol()).to.equal('CSV');

            const { certifMint, certifOwner } = await loadFixture(deployCertifMintFixture);
            const totalCertif = await csvMint.balanceOf(owner.address);
            expect(totalCertif).to.equal(0);
            expect(await certifMint.name()).to.equal('CertificateMint');
            expect(await certifMint.symbol()).to.equal('CRT');
        });
    });

    describe("Create CSV and hash", function () {
        it("Should create a CSV file and hash it", async function () {
            hash = await machine1.run();
            expect(await hash).to.be.a('string');
            console.log(`Hash: ${hash}`);

            //Run the machine and create the CSV file a second time for a test later
            //await machine1.run();
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

            expect(await csvMint.checkCSVToken(hash)).to.be.true;

        });
    });


    describe("Create Certificate", function () {
        it("Should create a certificate using the existing csv files", async function () {
            const { certifCreated, hashvalue } = await CreateCertificate.aggregateCSVFiles();
            certifHash = hashvalue;
            console.log("Certificate created: ", certifCreated);
            console.log("Certificate hash: ", certifHash);
            expect(certifCreated).to.be.true;
        });
    });

    describe("Check Certificate Token", function () {
        it("Should check the certificate hash with the token hash", async function () {

            expect(await certifMint.checkCertificateToken(certifHash)).to.be.true;

        });
    });



    describe("CertificateMarket", function () {
        let market, marketOwner, otherAccount;
        // let certifMint, certifOwner, certifOtherAccount;
        let tokenId = 0; // Example tokenId, adjust as needed

        // Deploy CertificateMarket
        async function deployCertificateMarketFixture() {
            [marketOwner, otherAccount] = await ethers.getSigners();
            const CertificateMarket = await ethers.getContractFactory("CertificateMarket");

            // Deploy CertificateMarket contract
            market = await CertificateMarket.deploy(certifMint.address);

            return { market, marketOwner, otherAccount };
        }

        describe("Market Deployment", function () {
            it("Should deploy the market contract", async function () {
                const { market, marketOwner } = await loadFixture(deployCertificateMarketFixture);
                expect(market.address).to.properAddress;
            });
        });

        describe("List NFT for Sale", function () {
            it("Should list an NFT for sale", async function () {

                const salePrice = ethers.utils.parseEther("1"); // 1 ETH for example

                console.log("SALE PRICE", salePrice);

                // Approve the market contract to transfer NFT
                await certifMint.connect(marketOwner).approve(market.address, tokenId);

                // List the NFT for sale
                await market.connect(marketOwner).listTokenForSale(tokenId, salePrice);

                // Check if NFT is listed for sale
                console.log(await market.tokenSales(tokenId));
                const sale = await market.tokenSales(tokenId);
                expect(sale.price).to.equal(salePrice);
            });
        });

        describe("Cancel Sale", function () {
            it("Should allow a seller to cancel a sale", async function () {


                // Cancel the sale
                await market.connect(marketOwner).cancelSale(tokenId);

                // Check if the sale is cancelled
                const sale = await market.tokenSales(tokenId);
                expect(sale.price).to.equal(0);
            });
        });

        describe("List NFT for Sale Again", function () {
            it("Should list an NFT for sale", async function () {

                const salePrice = ethers.utils.parseEther("1"); // 1 ETH for example

                console.log("SALE PRICE", salePrice);

                // Approve the market contract to transfer NFT
                await certifMint.connect(marketOwner).approve(market.address, tokenId);

                // List the NFT for sale
                await market.connect(marketOwner).listTokenForSale(tokenId, salePrice);

                // Check if NFT is listed for sale
                console.log(await market.tokenSales(tokenId));
                const sale = await market.tokenSales(tokenId);
                expect(sale.price).to.equal(salePrice);
            });
        });


        describe("Buy NFT", function () {
            it("Should allow a user to buy a listed NFT", async function () {

                const salePrice = ethers.utils.parseEther("1"); // Same as the list price
                const sale = await market.tokenSales(tokenId);
                console.log("SALE", sale);
                // Buyer buys the NFT
                console.log("actual owner of token", await certifMint.ownerOf(tokenId));
                console.log("OTHER ACCOUNT ADDRESS", otherAccount.address);
                await market.connect(otherAccount).buyToken(tokenId, { value: salePrice });

                // Check new owner of the NFT
                const newOwner = await certifMint.ownerOf(tokenId);
                console.log("new owner of token", newOwner);
                expect(newOwner).to.equal(otherAccount.address);
            });
        });


    });

    describe("Transfer CSV Token", function () {
        it("Should transfer the csv token to a new address", async function () {
            console.log("Actual owner of token: ", await csvMint.ownerOf(0));
            console.log("Other account address: ", otherAccount.address);
            await csvMint.transferTokenOwnership(0, otherAccount.address);
            console.log("New owner of token: ", await csvMint.ownerOf(0));
            expect(await csvMint.ownerOf(0)).to.equal(otherAccount.address, "Token was not transferred correctly");


        });
    });
    /*
    The transfer is now handled by the CertificateMarket contract
        describe("Transfer Certificate Token", function () {
            it("Should transfer the certificate token to a new address", async function () {
                console.log("Actual owner of token: ", await certifMint.ownerOf(0));
                console.log("Other account address: ", certifOtherAccount.address);
                await certifMint.transferTokenOwnership(0, certifOtherAccount.address);
                console.log("New owner of token: ", await certifMint.ownerOf(0));
                expect(await certifMint.ownerOf(0)).to.equal(certifOtherAccount.address, "Token was not transferred correctly");
            });
        });
    */

    after(() => {
        try {

            console.log("DELETING FILES");
            // Define the path to the directories
            const csvDirectory = path.join(__dirname, '..', 'csvFiles');
            const certDirectory = path.join(__dirname, '..', 'certificatesOutput');

            // Read the contents of the directory
            const csvfiles = fs.readdirSync(csvDirectory);
            const certfiles = fs.readdirSync(certDirectory);

            // Filter files with the .csv extension and delete them
            csvfiles.forEach(file => {
                if (path.extname(file) === '.csv') {
                    const filePath = path.join(csvDirectory, file);
                    try {
                        // Delete CSV file
                        fs.unlinkSync(filePath);
                        console.log(`Deleted CSV file: ${file}`);
                    } catch (err) {
                        console.error(`Error deleting CSV file ${file}: ${err}`);
                    }
                }
            });
            // Filter files with the .csv extension and delete them
            certfiles.forEach(file => {
                if (path.extname(file) === '.csv') {
                    const filePath = path.join(certDirectory, file);
                    try {
                        // Delete CSV file
                        fs.unlinkSync(filePath);
                        console.log(`Deleted CSV file: ${file}`);
                    } catch (err) {
                        console.error(`Error deleting CSV file ${file}: ${err}`);
                    }
                }
            });
        } catch (err) {
            console.error(`Error deleting files: ${err}`);
        }
    });



});