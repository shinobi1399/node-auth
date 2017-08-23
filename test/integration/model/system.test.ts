import {System, SystemModel, SystemModelEx} from '../../../src/model/system.model';
import * as m from 'mongoose';
import {expect} from 'chai';
import {Db} from 'mongodb';
import {setupTestMongoDb} from '../common/mongo.common';
import {IdentityStoreModel} from '../../../src/model/identity-store.model';
import {IdentityStoreBuilder} from './identity-store.test';

export class SystemBuilder {
  public static createSystem(): System {
    let obj = {
      identityStoreId: new m.Types.ObjectId(123),
      addDate: Date.now(),
      editDate: Date.now()
    };
    return new SystemModel(obj);
  }
}

describe('[integration] system tests', function () {
  let sut: SystemModelEx = SystemModel;
  let system: System;
  let savedSystem: System;
  let db: Db;

  async function setup() {
    db = await setupTestMongoDb();
    sut = SystemModel;

    system = SystemBuilder.createSystem();
    await system.save();
  }

  describe('[create system]', function () {
    it('system created correctly', async function () {
      await setup();

      expect(system.identityStoreId, ' identityStoreId').to.exist;
      expect(system.addDate, 'addDate').to.exist;
      expect(system.editDate, 'editDate').to.exist;
    });

    describe('[get system]', async function () {
      it('can get system', async function () {
        await setup();
        savedSystem = await sut.get();

        expect(savedSystem).is.instanceOf(sut);
        expect(savedSystem, 'system should exist').to.exist;
        expect(savedSystem.identityStoreId, 'identity store').to.eql(system.identityStoreId);
        expect(savedSystem.addDate, 'add date').to.eql(system.addDate);
        expect(savedSystem.editDate, 'edit date').to.eql(system.editDate);
      });

      it('can get identitystore', async function () {
        await setup();

        let store = IdentityStoreBuilder.createIdentityStore();
        await store.save();

        system.identityStoreId = store._id;
        await system.save();

        let retrievedStore = await system.getIdentityStore();

        expect(retrievedStore, 'retrievedstore').to.exist;
        expect(retrievedStore, 'store').is.instanceOf(IdentityStoreModel);
        expect(retrievedStore._id, 'id').to.eql(store._id);
      });
    });

  });

});
