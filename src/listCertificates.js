
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

            filesToDisplay.forEach(file => {
                console.log('inside the foreache');
                // Process each file
                console.log('File:', file);

                if (file.isValid == true) {

                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item list-group-item';
                    listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between ">
                    <input class="form-check-input me-1" type="checkbox" value="${file.fileName}" id="firstCheckbox" />
                    <h6 class="mb-1">${file.fileName}</h6> 
                    <p class="mb-1" style="color: green">Validity: ${file.isValid}</p>
                </div>
                <small class="text-body-secondary">id: ${file.tokenID}</small>
                <br />
                <small class="text-body-secondary">issuer: ${file.tokenIssuerAddress}</small>
                <br />
                <small class="text-body-secondary">Owner: ${file.tokenOwner}</small>
      `;
                    listGroup.appendChild(listItem);
                }
                else {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item list-group-item';
                    listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between ">
        <input class="form-check-input me-1" type="checkbox" value="" id="firstCheckbox" disabled/>
                    <h6 class="mb-1">${file.fileName}</h6> 
                    <p class="mb-1"style="color: red">Validity: ${file.isValid}</p>
                </div>
                <small class="text-body-secondary">id: -</small>
                <br />
                <small class="text-body-secondary">issuer: ${file.tokenIssuerAddress}</small>
                <br />
                <small class="text-body-secondary">Owner: ${file.tokenOwner}</small>
      `;
                    listGroup.appendChild(listItem);
                }

            });

        })
        .catch(error => console.error('Error fetching file list:', error));
}

// Call this function when the page loads or at an appropriate time
fetchFileList();
