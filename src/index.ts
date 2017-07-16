import * as e from 'express';
import * as mongo from 'mongodb';
import * as morgan from 'morgan';
import {getLogger, LoggingConfig, LoggingManager} from './logging/logging';
import config from './config/config';

let client = mongo.MongoClient;

let loggingConfig = config.get<LoggingConfig>('logging');
LoggingManager.configure(loggingConfig);

main().catch(err => {
    getLogger().error('unhandled error thrown. exiting', err);
});

async function main() {
    getLogger().info('Application starting');
    let mongoHost = process.env.MONGOHOST || 'localhost:27017';
    let mongoUrl = `mongodb://${mongoHost}/node-auth`;
    console.log('connecting to mongo url ' + mongoUrl);
    await client.connect(mongoUrl);

    let app = e();
    app.use(morgan('combined'));
    app.get('/', (req, res) => {
        res.send('hello world2');
    });

    let PORT = process.env.PORT || 3000;
    app.listen(PORT, function () {
        console.log(`listening on port ${PORT}`);
    });
}
