console.log("login script loaded.");

//import { ethers } from 'ethers';
const { ethers } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0x9d6F63ca01be1f5a0f790Be32cD4cFa12d29754F'; // Sepolia
const abi = require('../artifacts/contracts/CSVMint.sol/CSVMint.json').abi;

const connectButton = document.getElementById('connect-button');

let contract;

// Define the DEFAULT_ADMIN_ROLE
const DEFAULT_ADMIN_ROLE = ethers.utils.id("MINTER_ROLE");

async function checkIfUserIsAdmin(userAddress) {
    try {
        const isAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, userAddress);
        window.location.href = isAdmin ? 'certif.html' : 'tokenSale.html';
    } catch (error) {
        console.error("Error checking admin status:", error);
    }
}

connectButton.addEventListener('click', async () => {
    try {
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);

        const userAddress = await signer.getAddress();
        await checkIfUserIsAdmin(userAddress);

    } catch (error) {
        console.error("Error on connecting:", error);
    }
});
