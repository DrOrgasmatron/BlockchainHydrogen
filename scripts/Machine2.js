const Machine = require('./Machine');

class Machine2 extends Machine {
    constructor() {
        super('Machine 2');
    }

    run() {
        // Set up data for csv file
        const data = [
            ['Alice Brown', 25, 'San Francisco'],
            ['David Lee', 31, 'Boston'],
            ['Emily Kim', 39, 'Seattle'],
        ];

        // Create csv file with data
        this.createCsvFile(data, 2);
    }
}

const machine2 = new Machine2();
machine2.run();
