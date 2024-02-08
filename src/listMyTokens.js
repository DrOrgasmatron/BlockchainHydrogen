console.log('listMyTokens.js loaded');
let isUserAdminGlobal = false;
let currentAccount = null;
document.addEventListener('adminCheckComplete', (event) => {
    console.log('Is user admin:', event.detail); // event.detail contains the isAdmin value
    isUserAdminGlobal = event.detail;
});
document.addEventListener('currentAccountEvent', (event) => {
    console.log('Current Acccount inside listMyTokens:', event.detail); // event.detail contains the isAdmin value
    currentAccount = event.detail;
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

                if (file.tokenOwner.toLowerCase() === currentAccount.toLowerCase()) {
                    // Process each file
                    console.log('File:', file);

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
                <button id="btnShowCertificateContent" type="button" class="btn btn-primary btn-sm" data-tokenID="${file.tokenID}"  data-fileName="${file.fileName}" style="margin-bottom: 10px;">Show Certificate Content</button>
                </div>         
                `;
                    listGroup.appendChild(listItem);
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
