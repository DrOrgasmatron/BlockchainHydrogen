console.log('listCertificatesOnSale.js loaded');
let isUserAdminGlobal = false;
document.addEventListener('adminCheckComplete', (event) => {
    console.log('Is user admin:', event.detail); // event.detail contains the isAdmin value
    isUserAdminGlobal = event.detail;
});

function fetchFileList() {
    fetch('https://hka780hii3.execute-api.eu-central-1.amazonaws.com/beta/get-certificates')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Raw data:", data); // Log the raw data

            // Parse the 'body' property of the response if it's a string
            const files = data.body && typeof data.body === 'string' ? JSON.parse(data.body) : [];

            // Skip the first item in the array because it's the folder itself
            const filesToDisplay = files.slice(1);

            console.log('Parsed files:', filesToDisplay); // Log the parsed files

            const listGroup = document.querySelector('.list-group');
            listGroup.innerHTML = '';

            filesToDisplay.forEach(file => {
                console.log('inside the foreache');
                // Process each file
                console.log('File:', file);



                if (isUserAdminGlobal == true) {
                    if (file.isValid == true && file.isListedForSale == true) {
                        // Convert wei to ether
                        const priceInEther = ethers.utils.formatUnits(file.tokenPrice, 'ether');

                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item list-group-item';
                        listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between ">
                    <small class="text-body-secondary">id: ${file.tokenID}</small>
                    <h6 class="mb-1">${file.fileName}</h6> 
                    <p class="mb-1" style="color: green">Validity: ${file.isValid}</p>
                </div>
                
                <br />
                <small class="text-body-secondary">issuer: ${file.tokenIssuerAddress}</small>
                <br />
                <small class="text-body-secondary">Owner: ${file.tokenOwner}</small>
                <br />
                <small class="text-body-secondary">Is listed for Sale: ${file.isListedForSale}</small>
               
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                 <small class="text-body-secondary">Price: ${priceInEther}ETH</small>
                <button id="btnCancelCertificateSale" type="button" class="btn btn-danger btn-sm" data-tokenID="${file.tokenID}"  style="margin-bottom: 10px;">CANCEL SALE</button>
                </div>         
                `;
                        listGroup.appendChild(listItem);
                    }
                }
                else {

                    if (file.isValid == true && file.isListedForSale == true) {
                        // Convert wei to ether
                        const priceInEther = ethers.utils.formatUnits(file.tokenPrice, 'ether');

                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item list-group-item';
                        listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between ">
                    <small class="text-body-secondary">id: ${file.tokenID}</small>
                    <h6 class="mb-1">${file.fileName}</h6> 
                    <p class="mb-1" style="color: green">Validity: ${file.isValid}</p>
                </div>
                
                <br />
                <small class="text-body-secondary">issuer: ${file.tokenIssuerAddress}</small>
                <br />
                <small class="text-body-secondary">Owner: ${file.tokenOwner}</small>
                <br />
                <small class="text-body-secondary">Is listed for Sale: ${file.isListedForSale}</small>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <small class="text-body-secondary">Price: ${priceInEther}ETH</small>
                <button id="btnBuyCertificate" type="button" class="btn btn-info btn-sm" data-tokenID="${file.tokenID}" data-tokenPrice="${priceInEther}" style="margin-bottom: 10px;">Buy Certificate</button>
                </div>         
                `;
                        listGroup.appendChild(listItem);

                    }
                }
            });

            hideSpinner();
            listingFinished();

        })
        .catch(error => console.error('Error fetching file list:', error));
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function listingFinished() {
    document.dispatchEvent(new CustomEvent('certificatesListed'));
}

// Call this function when the page loads or at an appropriate time
document.addEventListener('adminCheckComplete', fetchFileList);
//fetchFileList();
