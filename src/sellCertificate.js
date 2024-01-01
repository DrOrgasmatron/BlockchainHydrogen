
//import { ethers } from 'ethers';
const { ethers } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractMarketAddress = '0xd9570C40AcC922b57120C7d1A841656198C23A99'; // Sepolia
const contractCertifAddress = '0x41722243a594BD56Ca059373107CD1Da1E77d4ED'; // Sepolia
const abiMarket = require('../artifacts/contracts/CertificateMarket.sol/CertificateMarket.json').abi;
const abiCertif = require('../artifacts/contracts/CertificateMint.sol/CertificateMint.json').abi;

// Open the modal with Bootstrap 5
var priceModal = new bootstrap.Modal(document.getElementById('priceModal'), {});




let contractMarket, contractCertif;

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

async function initContract() {
    contractMarket = await new ethers.Contract(contractMarketAddress, abiMarket, provider.getSigner());
    contractCertif = await new ethers.Contract(contractCertifAddress, abiCertif, provider.getSigner());

}




async function setupSellCertificates() {
    console.log('setupSellCertificates');



    // Add event listeners after the certificates are listed
    const buttons = document.querySelectorAll('.btn-warning');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Sell Certificate Button clicked');

            // Retrieve tokenID from button data attribute
            const tokenID = button.getAttribute('data-tokenID');
            console.log(tokenID);
            // Set tokenID in the field within the modal
            document.getElementById('hiddenModalTokenID').value = tokenID;
            document.getElementById('modalTokenID').textContent = tokenID;

            // Open Bootstrap Modal
            priceModal.show();
        });
    });
}

// Get the price from the modal when the user submits
document.getElementById('priceModalForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const price = document.getElementById('priceInput').value;
    const priceWEI = ethers.utils.parseEther(price.toString());

    const tokenID = document.getElementById('hiddenModalTokenID').value;

    console.log(tokenID, priceWEI);

    await initContract();
    await contractCertif.approve(contractMarketAddress, tokenID)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error(error);
        });

    // List the NFT for sale
    await contractMarket.listTokenForSale(tokenID, priceWEI)
        .then((result) => {
            console.log(result);
            appendAlert('The certificate was put on sale', 'success');
        })
        .catch((error) => {
            console.error(error);
            appendAlert('Error putting the certificate on sale', 'danger');
        });

    // Close the Bootstrap Modal
    priceModal.hide();
});


// Listen for the custom event before setting up the sell buttons
document.addEventListener('certificatesListed', setupSellCertificates);

// Call the setup function
//setupSellCertificates();


