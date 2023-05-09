const Machine = require('./Machine');

class Machine1 extends Machine {
    constructor() {
        super('Machine 1');
    }

    run() {

        // Set up data for csv file
        const data = [
            ['John Doe', 28, 'New York'],
            ['Jane Smith', 34, 'Los Angeles'],
            ['Bob Johnson', 42, 'Chicago'],
        ];

        // Create csv file with data
        return this.createCsvFile(data, 1);

    }
}

module.exports = Machine1;

//const machine1 = new Machine1();
//machine1.run();
