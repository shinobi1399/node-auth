import * as m from 'mongoose';
import {addAuditSaveMiddleware, setupModel} from '../common/data/model-utils';
import {IdentityStore, IdentityStoreModel} from './identity-store.model';

/**
 * A identity store for users.
 * Multiple stores can be setup and used to setup separate user bases for different apps.
 */
export interface System extends m.Document {
  identityStoreId: any;
  addDate?: Date;
  editDate?: Date;

  getIdentityStore(): IdentityStore;
}

let systemSchema = new m.Schema(
  {});

systemSchema.method('getIdentityStore', async function () {
  return await IdentityStoreModel.find({_id: this.identityStoreId}).limit(1);
});

addAuditSaveMiddleware(systemSchema);

export const SystemModel = setupModel<System>(
  'systemModel', systemSchema, 'system');
