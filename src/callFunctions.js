// Description: This file contains the functions that call the API endpoints for the CSV and Certificate creation in csv.html

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

document.getElementById('btnCreateCSV').addEventListener('click', function () {
    console.log('Create CSV Button clicked');
    showSpinner();
    fetch('https://hka780hii3.execute-api.eu-central-1.amazonaws.com/beta/machines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({

        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(appendAlert('The csv file was created', 'success'))
        .then(hideSpinner())
        .catch(error => console.error('Error:', error));

});

document.getElementById('btnCreateCertificate').addEventListener('click', function () {
    console.log('Create Certificate Button clicked');
    showSpinner();
    const selectedFiles = [];

    document.querySelectorAll('.list-group-item input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedFiles.push(checkbox.getAttribute('value'));
    });

    console.log(selectedFiles);

    if (selectedFiles.length === 0) {
        appendAlert('Please select at least one file', 'danger');
        return;
    }
    else {


        fetch('https://hka780hii3.execute-api.eu-central-1.amazonaws.com/beta/certificates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedFiles })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })

            .then(data => {
                console.log(data);
                appendAlert('The certificate was created', 'success');
                hideSpinner();
            })
            .catch(error => {
                console.error('Error:', error);
                appendAlert('Error creating the certificate', 'danger');
                hideSpinner();
            });
    }

});

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}
function showSpinner() {
    document.getElementById('loadingSpinner').style.display = '';
}
