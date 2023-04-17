var express = require("express");
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://130.192.137.1/TemperatureDB';

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());
app.post("/temperature", (req, res, next) => {
    var temperature = req.body.temperature;
    var timestamp = req.body.timestamp;
    var sensor = req.body.sensor;
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    async function run() {
        try {

            await client.connect();

            const database = client.db("TemperatureDB");
            const temperatureColl = database.collection("temperature");
            // create a document to be inserted
            const doc = {
                value: temperature,
                timestamp: timestamp,
                sensorId: sensor,
                roomId: 'room1'
            };
            const result = await temperatureColl.insertOne(doc);
            console.log(
                `Document inserted with the _id: ${result.insertedId}`,
            );

        } finally {
            await client.close();
        }

    }

    run().catch(console.dir);
    res.sendStatus(200);
});

app.get('/dashboard', (req, res) => {
    res.send('Hello World!');
})
