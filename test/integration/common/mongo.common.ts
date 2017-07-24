import * as mongoose from 'mongoose';
import {Db} from 'mongodb';

(<any>mongoose).Promise = global.Promise;

export async function setupTestMongoDb(): Promise<Db> {
  let db: Db = await mongoose.connect('mongodb://localhost/test', {useMongoClient: true});
  await db.dropDatabase();
  return db;
}
