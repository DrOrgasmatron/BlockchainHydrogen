const Machine = require('./Machine');

class Machine1 extends Machine {
    constructor() {
        super('Machine 1');
    }

    async run() {

        const datetime = this.readableDate();

        // Set up data for csv file
        const data = [
            [`${datetime}`, ,],
            ['H2O comsumption liters/day', 290000],
            ['MWH comsumption /day', 1375],
            ['H2 Output kg/day', 25000]
        ];
        // Create csv file with data
        console.log(data);
        return await this.createCsvFile(data, 1);
    }
}

module.exports = Machine1;

//const machine1 = new Machine1();
//machine1.run();
