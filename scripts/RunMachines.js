const hre = require("hardhat");
const ethers = hre.ethers;
const Machine1 = require("../scripts/Machine1");

const machine1 = new Machine1();

//const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; //local hardhat
const contractAddress = '0x9d6F63ca01be1f5a0f790Be32cD4cFa12d29754F'; //Sepolia

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