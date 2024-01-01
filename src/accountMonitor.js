console.log("Account monitor script loaded.");
//import { ethers } from 'ethers';
const { ethers } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0x9d6F63ca01be1f5a0f790Be32cD4cFa12d29754F'; // Sepolia
const abi = require('../artifacts/contracts/CSVMint.sol/CSVMint.json').abi;

let contract;
let isUserAdminGlobal = false;



const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

// Function to initialize the ethers contract
function initContract() {
    contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
}

let currentAccount = null;
// Function to handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        // Potentially inform the user they need to connect MetaMask
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0]; // Update the current account
        console.log('Selected account changed to:', currentAccount);
        // Proceed with checking the user's role and redirecting
        checkUserRoleAndRedirect(currentAccount);
    }
}

// Function to check if the user is an admin and redirect
async function checkUserRoleAndRedirect(account) {
    try {
        document.getElementById('loadingSpinner').style.display = '';

        initContract();
        const DEFAULT_ADMIN_ROLE = ethers.utils.id("MINTER_ROLE");
        const isAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, account);
        // Prevent redirection loop by checking if the location is already where it needs to be
        if (!isAdmin && window.location.pathname !== '/tokenSale.html') {
            appendAlert('You do not have the persmission', 'Error')
            // After checking the role...
            document.dispatchEvent(new CustomEvent('adminCheckComplete', { detail: isUserAdminGlobal }));

            window.location.href = 'tokenSale.html';
        }

        isUserAdminGlobal = isAdmin;
        // After checking the role...
        document.dispatchEvent(new CustomEvent('adminCheckComplete', { detail: isUserAdminGlobal }));




    } catch (error) {
        console.error('Error checking if user is admin:', error);
    }
}

// Request the initial account
window.ethereum.request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
        console.error('Error requesting accounts:', err);
    });

// Listen for account changes
window.ethereum.on('accountsChanged', handleAccountsChanged);
