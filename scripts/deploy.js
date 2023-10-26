// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { upgrades } = require("@openzeppelin/hardhat-upgrades");
async function main() {
  // Get the contract owner
  const contractOwner = await ethers.getSigners();
  console.log(`Deploying contracts from: ${contractOwner[0].address}`);
  let defaultAdmin = contractOwner[0].address;
  let pauser = contractOwner[0].address;
  let minter = contractOwner[0].address;
  // Hardhat helper to get the ethers contractFactory object
  const CSVMint = await ethers.getContractFactory('CSVMint');
  const CertificateMint = await ethers.getContractFactory('CertificateMint');

  // Deploy the CSVMINT contract
  console.log('Deploying CSVMint...');
  //const csvmint = await CSVMint.deploy();
  const csvmint = await CSVMint.deploy(defaultAdmin, pauser, minter);
  await csvmint.deployed();
  console.log(`CSVMint deployed to: ${csvmint.address}`);

  // Deploy the CertificateMint contract
  console.log('Deploying CertificateMint...');
  //const csvmint = await CSVMint.deploy();
  const certifmint = await CertificateMint.deploy(defaultAdmin, pauser, minter);
  await certifmint.deployed();
  console.log(`CertificateMint deployed to: ${certifmint.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

