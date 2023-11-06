const fsExtra = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const inputDirectory = path.join(__dirname, '..', 'csvFiles');
const outputDirectory = path.join(__dirname, '..', 'certificatesOutput');

// Ensure the output directory exists
fsExtra.ensureDirSync(outputDirectory);

const certifMintAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const csvMintAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Function to aggregate CSV files
async function aggregateCSVFiles() {
    try {
        const csvMint = await hre.ethers.getContractAt("CSVMint", csvMintAddress);
        const symbol = await csvMint.symbol();
        console.log(`Symbol: ${symbol}`);




        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const readableDate = `${year}-${month}-${day}-${hour}${minute}${second}`;

        const csvFiles = fsExtra.readdirSync(inputDirectory).filter(file => file.endsWith('.csv'));

        if (csvFiles.length === 0) {
            console.log("No CSV files found in the input directory.");
            return;
        }

        let aggregatedData = [];

        // Read and aggregate data from each CSV file
        for (const csvFile of csvFiles) {
            const filePath = path.join(inputDirectory, csvFile);

            //Check the validity of the file with the csvmint contract
            const csvFileHash = await calculateFileHash(filePath);
            if (await csvMint.checkCSVToken(csvFileHash)) {
                console.log("File: " + filePath + " VALIDITY: " + await csvMint.checkCSVToken(csvFileHash));
            } else {

                console.log("File: " + filePath + " VALIDITY: " + await csvMint.checkCSVToken(csvFileHash));
                //throw new Error('Invalid file found');
                return { certifCreated: false, hashvalue: null };
            }


            const data = fsExtra.readFileSync(filePath, 'utf8').split('\n');
            let isFirstRow = true;

            for (const row of data) {
                if (row.trim() !== '') {
                    const columns = row.split(',');
                    if (columns.length >= 2) {
                        if (isFirstRow) {
                            isFirstRow = false;
                        } else {
                            if (!aggregatedData[columns[0]]) {
                                aggregatedData[columns[0]] = 0;
                            }
                            aggregatedData[columns[0]] += parseFloat(columns[1].trim());
                        }
                    }
                }
            }
        }

        const outputFilename = 'Certificate' + readableDate + '.csv';
        const outputPath = path.join(outputDirectory, outputFilename);

        const outputData = Object.entries(aggregatedData).map(([key, value]) => `${key},${value}`);
        fsExtra.writeFileSync(outputPath, outputData.join('\n'));

        console.log(`Aggregated data saved to ${outputPath}`);

        const fileHash = await calculateFileHash(outputPath);
        console.log(`File hash: ${fileHash}`);

        const certificateMinted = await mintCertificate(fileHash, readableDate);
        if (certificateMinted) {
            console.log('Certificate successfully minted.');
            return { certifCreated: true, hashvalue: fileHash };
        } else {
            console.log('Certificate minting failed.');
            return { certifCreated: false, hashvalue: null };
        }

    } catch (err) {
        console.error('Error aggregating CSV files:', err);
        return false;
    }
}

async function calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const input = fsExtra.createReadStream(filePath);

        input.on('data', (data) => {
            hash.update(data);
        });

        input.on('end', () => {
            const fileHash = hash.digest('hex');
            resolve(fileHash);
        });

        input.on('error', (err) => {
            reject(err);
        });
    });
}

async function mintCertificate(fileHash, date) {
    try {
        // Assuming hre is available in the scope where this script is executed
        const myContract = await hre.ethers.getContractAt("CertificateMint", certifMintAddress);
        const symbol = await myContract.symbol();
        console.log(`Symbol: ${symbol}`);

        await myContract.mintCertificate(fileHash, date);
        return true;
    } catch (err) {
        console.error('Error minting certificate:', err);
        return false;
    }
}

module.exports = {
    aggregateCSVFiles
};

// Call the function to start the aggregation process
//aggregateCSVFiles();
