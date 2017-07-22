import * as mongoose from 'mongoose';
import * as mongo from 'mongodb';
import {expect} from 'chai';
import {IdentityStore, IdentityStoreModel} from '../../../src/model/identity-store.model';

require('bluebird');
(<any>mongoose).Promise = global.Promise;

describe('identity store tests', function () {
  let db: mongo.Db;
  beforeEach(async function () {
    db = await mongoose.connect('mongodb://localhost/test', {useMongoClient: true});

    await db.dropDatabase();
  });
  afterEach(async function () {
    await db.close();
  });

  describe('crud tests', async function () {

  });
  describe('[insert record]', async function () {
    let store: IdentityStore;
    beforeEach(async function () {
      store = createIdentityStore();

      await store.save();
    });
    it('record should exist', async function () {
      let count = await IdentityStoreModel.find().count();

      expect(count).eq(1);
    });
    it('add date should be set', function () {
      expect(store.addDate, 'add date should be set').to.exist;
    });

    it('edit date should be set', function () {
      expect(store.editDate, 'edit date should be set').to.exist;
    });

    describe('[update record]', function () {
      beforeEach(async function () {
        store.name = 'changed';
        await store.save();
        store = <IdentityStore> await IdentityStoreModel.findById(store._id);
      });

      it('name should have been updated', function () {
        expect(store.name).to.eq('changed');
      });
    });

    describe('[delete record]', function () {
      beforeEach(async function () {
        await store.remove();
      });

      it('record should be deleted', async function () {
        let count = await IdentityStoreModel.find().count();

        expect(count).to.eq(0);
      });
    });
  });
});

function createIdentityStore(): IdentityStore {
  let store = new IdentityStoreModel();
  store.name = 'name';
  return store;
}
