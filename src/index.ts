import * as e from "express";
import * as mongo from 'mongodb';

let client = mongo.MongoClient;
main();
async function main() {
    let mongoHost = process.env.MONGOHOST || 'localhost:27017';
    let mongoUrl = `mongodb://${mongoHost}/node-auth`;
    console.log('connecting to mongo url ' + mongoUrl);
    await client.connect(mongoUrl);

    let app = e();
    app.get('/', (req, res) => {
        res.send('hello world2');
    });

    let PORT = process.env.PORT || 3000;
    app.listen(PORT, function() {
        console.log(`listening on port ${PORT}`)
    })
}
