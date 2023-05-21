import { ethers } from 'ethers';

// Connect to the Ethereum network using ethers
const provider = new ethers.providers.Web3Provider(window.ethereum);

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const abi = require('../artifacts/contracts/CSVMint.sol/CSVMint.json').abi;

const connectButton = document.getElementById('connect-button');
const addressValue = document.getElementById('address-value');
const isConnectedValue = document.getElementById('is-connected-value');
const contractName = document.getElementById('contract-name');
const contractSymbol = document.getElementById('contract-symbol');
const contractAddressValue = document.getElementById('contract-address-value');
const tokenId = document.getElementById('token-id');
const csvHash = document.getElementById('csv-hash');
const dateMinted = document.getElementById('date-minted');

let isConnected = false;
let signer;
let contract;

connectButton.addEventListener('click', async () => {
    try {
        isConnectedValue.innerText = 'Loading...';
        await provider.send('eth_requestAccounts', []);

        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);



        const address = await signer.getAddress();
        addressValue.innerText = address;
        isConnectedValue.innerText = 'Connected';
        isConnected = true;

        const symbol = await contract.symbol();
        contractSymbol.innerText = symbol;
        const name = await contract.name();
        contractName.innerText = name;
        contractAddressValue.innerText = contractAddress;

        //console.log(`Symbol: ${symbol}`);
        //console.log(`Name: ${name}`);
    } catch (error) {
        console.log(error);
        isConnectedValue.innerText = `Error occurred. ${error}`;
        isConnected = false;
    }
});

// Dropzone initialization
Dropzone.autoDiscover = false;
const dropzone = new Dropzone("#upload-form", {
    url: "/upload",
    autoProcessQueue: false, // Disable automatic file upload
    maxFiles: 1 // Allow only one file to be dropped
});

dropzone.on("addedfile", async function (file) {
    // Called when a file is added to the dropzone

    // Read the file data
    const reader = new FileReader();
    reader.onload = async function (event) {
        const fileData = event.target.result;

        try {
            if (!isConnected) {
                alert('Connect to the wallet');
                return;
            }

            // Hash the fileData using SHA-256
            const encoder = new TextEncoder();
            const data = encoder.encode(fileData);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

            // Call the smart contract function and pass the fileData as a parameter
            const isCSVValid = await contract.checkCSVToken(hash);
            console.log(await contract.getAllCSVToken());

            if (isCSVValid) {
                // Set Dropzone container background color to green if the CSV is valid
                document.getElementById("upload-form").style.backgroundColor = "green";
                const tokenID = await contract.getTokenIDFromHash(hash);
                const date = await contract.getTokenDateFromHash(hash);
                //console.log(`Token ID: ${tokenID}`);
                //console.log(`Hash: ${hash}`);
                //console.log(`Date minted: ${dateMinted}`);
                tokenId.innerText = tokenID;
                csvHash.innerText = hash;
                dateMinted.innerText = date;



                //alert("CSV is valid");
            } else {
                // Set Dropzone container background color to red if the CSV is not valid
                document.getElementById("upload-form").style.backgroundColor = "red";
                tokenId.innerText = "";
                csvHash.innerText = "";
                dateMinted.innerText = "";

                //alert("CSV is not valid");
            }
        } catch (error) {
            console.log(error);
            alert("Error occurred while checking CSV");
        }
    };
    reader.readAsText(file); // Read file as text
});

dropzone.on("removedfile", function (file) {
    // Called when a file is removed from the dropzone

    // Reset Dropzone container background color
    document.getElementById("upload-form").style.backgroundColor = "";
});



// Get the delete files button element
const deleteFilesBtn = document.getElementById('delete-files-btn');

// Add click event listener to the delete files button
deleteFilesBtn.addEventListener('click', function () {
    // Remove all files from the Dropzone
    dropzone.removeAllFiles(true);
});
