import {setupTestMongoDb} from './common/mongo.common';
import {addMigrations} from '../../src/migrations/index';
import mongoMigrator from '../../src/common/data/mongo-migrate';

describe('[integration] Run migrations', async function () {
  it('run migrations succeeds ', async function () {
    let db = await setupTestMongoDb();
    addMigrations();
    await mongoMigrator.migrate(db);

  });

});
