const fsExtra = require('fs-extra');
const path = require('path');

const inputDirectory = path.join(__dirname, '..', 'csvFiles'); // Replace with the directory where your CSV files are stored
const outputDirectory = path.join(__dirname, '..', 'certificatesOutput'); // Replace with the directory where you want to save the aggregated CSV

// Ensure the output directory exists
fsExtra.ensureDirSync(outputDirectory);

// Function to aggregate CSV files
async function aggregateCSVFiles() {
    try {
        // Get a list of CSV files in the input directory
        const csvFiles = fsExtra.readdirSync(inputDirectory).filter(file => file.endsWith('.csv'));

        if (csvFiles.length === 0) {
            console.log("No CSV files found in the input directory.");
            return;
        }

        // Initialize an array to hold the aggregated data
        let aggregatedData = [];


        aggregatedData.push(`${new Date().toISOString()},CERTIFICATE OF CO2 OFFSET`);
        // Read and aggregate data from each CSV file
        for (const csvFile of csvFiles) {
            const filePath = path.join(inputDirectory, csvFile);

            // Read the CSV file and aggregate data from the second column to the aggregatedData array
            const data = fsExtra.readFileSync(filePath, 'utf8').split('\n');
            let isFirstRow = true; // Add this variable to track the first row

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


        // Create a new CSV file for the aggregated data
        const outputFilename = 'AggregatedData.csv';
        const outputPath = path.join(outputDirectory, outputFilename);

        // Write the aggregated data to the output file
        const outputData = Object.entries(aggregatedData).map(([key, value]) => `${key},${value}`);
        fsExtra.writeFileSync(outputPath, outputData.join('\n'));

        console.log(`Aggregated data saved to ${outputPath}`);
    } catch (err) {
        console.error('Error aggregating CSV files:', err);
    }
}

// Call the function to start the aggregation process
aggregateCSVFiles();
