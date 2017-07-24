import * as express from 'express';
import * as mongo from 'mongodb';
import * as morgan from 'morgan';
import {getLogger, LoggingConfig, LoggingManager} from './common/logging/logging';
import config from './common/config/config';
import mongoMigrate from './common/data/mongo-migrate';
import {addMigrations} from './migrations/index';
import {usersRouter} from './routes/v1/users';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

let client = mongo.MongoClient;
(<any>mongoose).Promise = global.Promise;

// Setup logging
let loggingConfig = config.get<LoggingConfig>('logging');
LoggingManager.configure(loggingConfig);

// Read config params
let mongoConnectionUrl = config.get<string>('db.connectionUrl') || 'mongodb://localhost/node-auth';

let app = express();

async function main() {
  getLogger().info('Application starting');
  await setupMongoDb();

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    return res.status(err.status || 500).render('500');
  });

  app.use(bodyParser.json());
  app.use(morgan('combined'));

  configureRoutes();

  startServer();
}

function startServer() {
  let expressPort = process.env.PORT || config.get<Number>('express.port') || 3000;
  app.listen(expressPort, function () {
    getLogger().info(`listening on port ${expressPort}`);
  });

}

function configureRoutes() {
  app.use('/public', express.static('./public'));
  usersRouter.configure(app);
  app.get('/', (req, res) => {
    res.send('hello world2');
  });
}

async function setupMongoDb() {
  getLogger().info('connecting to db ', mongoConnectionUrl);
  let db = await mongoose.connect(mongoConnectionUrl, {useMongoClient: true});

  getLogger().info('Updating db migrations');
  addMigrations();
  await mongoMigrate.migrate(db);
}

main().catch(err => {
  getLogger().error('unhandled error thrown. exiting', err);
});
