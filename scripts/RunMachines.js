const hre = require("hardhat");
const ethers = hre.ethers;
const Machine1 = require("../scripts/Machine1");

const machine1 = new Machine1();

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
    const myContract = await hre.ethers.getContractAt("CSVMint", contractAddress);
    const symbol = await myContract.symbol();
    console.log(`Symbol: ${symbol}`);
    await myContract.mintCSV(machine1.run(), machine1.readableDate());
    console.log(await myContract.getAllCSVToken());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });