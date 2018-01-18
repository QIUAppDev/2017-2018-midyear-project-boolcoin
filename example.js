const coindesk = require('node-coindesk-api');
const synaptic = require('synaptic');

var Options = function(startDate, endDate){ //class that holds dates
    this.startDate = startDate;
    this.endDate = endDate;
}
var start = new Date(2017, 12, 09); //assigns start date
var end = new Date(2018, 01, 10); //assigns end date
var options = new Options(start, end); //creates options

var btcPrices = [.1605714, .149134, .1503696] //inputs last price before historical data. won't need this after 1 month
var threeDays = .1605714;
var twoDays = .149134;
var yesterday = .1503696;
var counter = 3; //need a counter for the foreach loop

//001 is buy, 010 is sell, 100 is keep
//trainset is 12/11/17 to 1/10/18
var trainset = [ //input will be populated in priceTrain() function
    {input: [], output: [0,1,0]}, // 12/11/17
    {input: [], output: [0,1,0]}, // 12/12/17
    {input: [], output: [0,0,1]}, // 12/13/17
    {input: [], output: [0,0,1]}, // 12/14/17
    {input: [], output: [1,0,0]}, // 12/15/17
    {input: [], output: [0,1,0]}, // 12/16/17
    {input: [], output: [0,1,0]}, // 12/17/17
    {input: [], output: [0,1,0]}, // 12/18/17
    {input: [], output: [1,0,0]}, // 12/19/17
    {input: [], output: [1,0,0]}, // 12/20/17
    {input: [], output: [1,0,0]}, // 12/21/17
    {input: [], output: [0,0,1]}, // 12/22/17
    {input: [], output: [0,1,0]}, // 12/23/17
    {input: [], output: [0,0,1]}, // 12/24/17
    {input: [], output: [0,0,1]}, // 12/25/17
    {input: [], output: [0,1,0]}, // 12/26/17
    {input: [], output: [0,1,0]}, // 12/27/17
    {input: [], output: [1,0,0]}, // 12/28/17
    {input: [], output: [1,0,0]}, // 12/29/17
    {input: [], output: [0,1,0]}, // 12/30/17
    {input: [], output: [0,1,0]}, // 12/31/17
    {input: [], output: [0,0,1]}, // 1/01/18
    {input: [], output: [1,0,0]}, // 1/02/18
    {input: [], output: [1,0,0]}, // 1/03/18
    {input: [], output: [1,0,0]}, // 1/04/18
    {input: [], output: [0,1,0]}, // 1/05/18
    {input: [], output: [0,1,0]}, // 1/06/18
    {input: [], output: [1,0,0]}, // 1/07/18
    {input: [], output: [1,0,0]}, // 1/08/18
    {input: [], output: [0,1,0]}, // 1/09/18
    {input: [], output: [0,1,0]}, // 1/10/18
]

const network = new synaptic.Architect.LSTM(4,6,3);
const trainer = new synaptic.Trainer(network);

coindesk.getHistoricalClosePrices(options).then(function(data){ //populates trainset (async)
    var bpi = data.bpi;
    for(var prop in bpi){ //populates btcPrices
        btcPrices.push((bpi[prop]/100000));
    }
    console.log(btcPrices);

    trainset.forEach(element => { //adds them to trainset
        element.input = [threeDays, twoDays, yesterday, btcPrices[counter]];
        threeDays = twoDays;
        twoDays = yesterday;
        yesterday = btcPrices[counter];
        counter++;
    });
    const trainResults = trainer.train(trainset, {
        log: 1000,
        iterations: 50000,
        error: .18,
        rate: 0.1
    });
    test(trainset);
});