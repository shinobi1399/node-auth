import * as mongoose from 'mongoose';
import * as mongo from 'mongodb';
import {expect} from 'chai';
import {IdentityStore, IdentityStoreModel} from '../../../src/model/identity-store.model';
import {setupTestMongoDb} from '../common/mongo.common';

(<any>mongoose).Promise = global.Promise;

describe('identity store tests', async function () {
  let db: mongo.Db;
  let store: IdentityStore;

  async function setup() {
    db = await setupTestMongoDb();
    store = IdentityStoreBuilder.createIdentityStore();

    await store.save();
  }

  describe('[insert record]', async function () {

    it('record should exist', async function () {
      await setup();
      let existing = <IdentityStore> await IdentityStoreModel.findById(store._id);

      expect(existing.name).eq(store.name);
      expect(existing.description).to.eq(store.description);
    });

    it('add date should be set', async function () {
      await setup();
      expect(store.addDate, 'add date should be set').to.exist;
    });

    it('edit date should be set', function () {
      expect(store.editDate, 'edit date should be set').to.exist;
    });

    describe('[update record]', async function () {
      async function updateRecord() {
        store.name = 'changed';
        await store.save();
        store = <IdentityStore> await IdentityStoreModel.findById(store._id);
      }

      it('name should have been updated', async function () {
        await setup();

        await updateRecord();

        expect(store.name).to.eq('changed');
      });
    });

    describe('[delete record]', function () {
      it('record should be deleted', async function () {
        await setup();

        await store.remove();

        let count = await IdentityStoreModel.find().count();
        expect(count).to.eq(0);
      });
    });
  });
});

export class IdentityStoreBuilder {
  public static createIdentityStore(): IdentityStore {
    let store = new IdentityStoreModel();
    store.name = 'name';
    store.description = 'description';
    return store;
  }
}
