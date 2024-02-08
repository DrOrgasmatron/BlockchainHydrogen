
// Open the modal with Bootstrap 5
var contentModal = new bootstrap.Modal(document.getElementById('contentModal'), {});


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

async function setupShowCertifContent() {
    console.log('setupShowCertifContent');
    // Add event listeners after the certificates are listed
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Show Certificate Content Button clicked');

            // Retrieve tokenID from button data attribute
            const tokenID = button.getAttribute('data-tokenID');
            const fileName = button.getAttribute('data-fileName');
            console.log(tokenID);
            console.log(fileName);
            // Set tokenID in the field within the modal
            document.getElementById('hiddenModalTokenID').value = tokenID;
            document.getElementById('modalTokenID').textContent = tokenID;

            // Set file name in the field within the modal
            document.getElementById('modalFileName').textContent = fileName;

            showCertificateContentModal(fileName);
        });
    });
}

/// Function to fetch file content and display in modal
async function showCertificateContentModal(fileName) {
    try {
        const response = await fetch(`https://hka780hii3.execute-api.eu-central-1.amazonaws.com/beta/showCertificateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileKey: `${fileName}` })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data:', data);

        // Parse the body field in the response to get the actual content
        const parsedBody = JSON.parse(data.body);
        console.log('Parsed body:', parsedBody);


        if (parsedBody.content) {
            // Replace newline characters with HTML line breaks
            const formattedContent = parsedBody.content.replace(/\n/g, '<br>');
            document.getElementById('certificateContent').innerHTML = formattedContent;
        } else {
            document.getElementById('certificateContent').textContent = 'No content available';
        }

        // Display the modal
        contentModal.show();
    } catch (error) {
        console.error('Error fetching file content:', error);
    }
}
// Listen for the custom event before setting up the sell buttons
document.addEventListener('certificatesListed', setupShowCertifContent);


