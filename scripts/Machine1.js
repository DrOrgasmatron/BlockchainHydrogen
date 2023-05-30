const Machine = require('./Machine');

class Machine1 extends Machine {
    constructor() {
        super('Machine 1');
    }

    async run() {

        const datetime = this.readableDate();

        // Set up data for csv file
        const data = [
            ['Water', 2800, 'Liters'],
            ['Electricity', 348, 'Watts/hour'],
            ['Hydrogen', 1500, 'Liters'],
            [`${datetime}`, ,]
        ];
        // Create csv file with data
        console.log(data);
        return await this.createCsvFile(data, 1);
    }
}

module.exports = Machine1;

//const machine1 = new Machine1();
//machine1.run();
