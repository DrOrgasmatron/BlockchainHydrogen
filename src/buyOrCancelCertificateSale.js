
//import { ethers } from 'ethers';
const { ethers } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractMarketAddress = '0xd9570C40AcC922b57120C7d1A841656198C23A99'; // Sepolia
const contractCertifAddress = '0x41722243a594BD56Ca059373107CD1Da1E77d4ED'; // Sepolia
const abiMarket = require('../artifacts/contracts/CertificateMarket.sol/CertificateMarket.json').abi;
const abiCertif = require('../artifacts/contracts/CertificateMint.sol/CertificateMint.json').abi;

let isUserAdminGlobal = false;
document.addEventListener('adminCheckComplete', (event) => {
    console.log('Is user admin:', event.detail); // event.detail contains the isAdmin value
    isUserAdminGlobal = event.detail;
});


// Open the modal with Bootstrap 5
var cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'), {});
var buyModal = new bootstrap.Modal(document.getElementById('buyModal'), {});




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




async function setupButtons() {
    console.log('Setting up buttons');
    console.log('Is user admin:', isUserAdminGlobal);
    try {
        if (isUserAdminGlobal) {

            // Add event listeners after the certificates are listed
            const buttons = document.querySelectorAll('.btn-danger');
            buttons.forEach(button => {
                button.addEventListener('click', (event) => {
                    console.log('Cancel Certificate Sale Button clicked');

                    // Retrieve tokenID from button data attribute
                    const tokenID = button.getAttribute('data-tokenID');
                    console.log("TokenID when event listener is added: ", tokenID);
                    // Set tokenID in the field within the modal
                    document.getElementById('cancelHiddenModalTokenID').value = tokenID;
                    document.getElementById('cancelModalTokenID').textContent = tokenID;

                    console.log("hiddenmodaltokenid: ", document.getElementById('cancelHiddenModalTokenID').value);
                    console.log("modaltokenid", document.getElementById('cancelModalTokenID').textContent);

                    // Open Bootstrap Modal
                    cancelModal.show();
                });
            });
        }
        else {
            // Add event listeners after the certificates are listed
            const buttons = document.querySelectorAll('.btn-info');
            buttons.forEach(button => {
                button.addEventListener('click', (event) => {
                    console.log('Buy Certificate  Button clicked');

                    // Retrieve tokenID from button data attribute
                    const tokenID = button.getAttribute('data-tokenID');
                    console.log(tokenID);
                    // Set tokenID in the field within the modal
                    document.getElementById('buyHiddenModalTokenID').value = tokenID;
                    document.getElementById('buyModalTokenID').textContent = tokenID;

                    // Retrieve tokenPrice from button data attribute
                    const tokenPrice = button.getAttribute('data-tokenPrice');
                    console.log(tokenPrice);
                    // Set tokenID in the field within the modal
                    document.getElementById('buyHiddenModalTokenPrice').value = tokenPrice;
                    document.getElementById('buyModalTokenPrice').textContent = tokenPrice;


                    // Open Bootstrap Modal
                    buyModal.show();
                });
            });
        }
    }
    catch (error) {
        console.error(error);
    }
}



// Get the cancel from the modal when the user submits
document.getElementById('cancelModalForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tokenID = document.getElementById('cancelHiddenModalTokenID').value;
    console.log('Canceling sale for tokenID:', tokenID);



    await initContract();

    // Cancel the NFT sale
    await contractMarket.cancelSale(tokenID)
        .then((result) => {
            console.log(result);
            appendAlert('The certificate sale was canceled', 'success');
        })
        .catch((error) => {
            console.error(error);
            appendAlert('Error canceling the certificate sale', 'danger');
        });


    // Close the Bootstrap Modal
    cancelModal.hide();
});

// Get the buy from the modal when the user submits
document.getElementById('buyModalForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tokenID = document.getElementById('buyHiddenModalTokenID').value;
    const tokenPrice = document.getElementById('buyHiddenModalTokenPrice').value;
    console.log("Buying token n°", tokenID);
    console.log("Price: ", tokenPrice);


    await initContract();

    // Buy the NFT for sale
    await contractMarket.buyToken(tokenID, { value: ethers.utils.parseEther(tokenPrice) })
        .then((result) => {
            console.log(result);
            appendAlert('The certificate was sold', 'success');
        })
        .catch((error) => {
            console.error(error);
            appendAlert('Error with the certificate sale', 'danger');
        });


    // Close the Bootstrap Modal
    buyModal.hide();
});

// Listen for the custom event before setting up the sell buttons
document.addEventListener('certificatesListed', setupButtons);

// Call the setup function
//setupSellCertificates();


