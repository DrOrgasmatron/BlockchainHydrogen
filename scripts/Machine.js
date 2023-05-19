const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const { Console } = require('console');
const crypto = require('crypto');
const fsExtra = require('fs-extra'); //changed from fs to fsExtra
const path = require('path');

class Machine {
    constructor(name) {
        this.name = name;
    }

    createCsvFile(data, machineNumber) {
        return new Promise((resolve, reject) => {
            //console.log("In the promise of Machine.js");


            // Get current date and time
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');

            // Set up headers for csv file
            const headers = [
                { id: 'name', title: 'Name' },
                { id: 'age', title: 'Age' },
                { id: 'city', title: 'City' },
            ];


            // Create csv writer and write data to file
            const filename = `Machine${machineNumber}_${year}-${month}-${day}-${hour}${minute}${second}.csv`;
            console.log(`Creating CSV file ${filename}...`);
            const csvPath = path.join(__dirname, '..', 'csvFiles', filename);
            // console.log(`after path.join`);



            const csvWriter = createCsvWriter({
                header: headers,
                path: csvPath,
            });
            // console.log(`after createCsvWriter`);

            csvWriter.writeRecords(data)
                .then(() => {
                    console.log(`CSV file ${filename} created successfully!`);

                    // Hash the file
                    const hash = crypto.createHash('sha256');
                    const input = fsExtra.createReadStream(csvPath);
                    input.on('readable', () => {
                        const data = input.read();
                        if (data) {
                            hash.update(data);
                        } else {
                            const fileHash = hash.digest('hex');
                            console.log(`File hash: ${fileHash}`);
                            resolve(fileHash);
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                    console.log("Error in the promise of Machine.js cswwriter");
                });

        });
    }

}

module.exports = Machine;
