import * as express from 'express';
import * as mongo from 'mongodb';
import * as morgan from 'morgan';
import {getLogger, LoggingConfig, LoggingManager} from './common/logging/logging';
import config from './common/config/config';
import mongoMigrate from './common/data/mongo-migrate';
import {addMigrations} from './migrations/index';

let client = mongo.MongoClient;

// Setup logging
let loggingConfig = config.get<LoggingConfig>('logging');
LoggingManager.configure(loggingConfig);

// Read config params
let mongoConnectionUrl = config.get<string>('db.connectionUrl') || 'mongodb://localhost/node-auth';
let expressPort = process.env.PORT || config.get<Number>('express.port') || 3000;

async function main() {
  getLogger().info('Application starting');
  getLogger().info('connecting to db ', mongoConnectionUrl);
  let db = await client.connect(mongoConnectionUrl);

  getLogger().info('Updating db migrations');
  addMigrations();
  await mongoMigrate.migrate(db);

  let app = express();

  app.use(morgan('combined'));
  app.use('/public', express.static('./public'));
  app.get('/', (req, res) => {
    res.send('hello world2');
  });

  app.listen(expressPort, function () {
    getLogger().info(`listening on port ${expressPort}`);
  });
}

main().catch(err => {
  getLogger().error('unhandled error thrown. exiting', err);
});
