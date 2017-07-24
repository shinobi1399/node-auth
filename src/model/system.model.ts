import * as m from 'mongoose';
import {addAuditSaveMiddleware, setupModel} from '../common/data/model-utils';
import {IdentityStore, IdentityStoreModel} from './identity-store.model';

/**
 * A identity store for users.
 * Multiple stores can be setup and used to setup separate user bases for different apps.
 */
export interface System extends m.Document {
  identityStoreId: m.Types.ObjectId;
  addDate?: Date;
  editDate?: Date;

  getIdentityStore(): IdentityStore;
}

export interface SystemModelEx extends m.Model<System> {
  get(): Promise<System>;
}


let systemSchema = new m.Schema(
  {
    identityStoreId: {type: m.SchemaTypes.ObjectId},
    addDate: {type: Date},
    editDate: {type: Date}
  });

systemSchema.method('getIdentityStore', async function (): Promise<IdentityStore | null> {
  return await IdentityStoreModel.findById({_id: this.identityStoreId});
});

systemSchema.static('get', async function (): Promise<System> {
  return await this.findOne({});
});

addAuditSaveMiddleware(systemSchema);

let SystemModel: SystemModelEx = <SystemModelEx> setupModel<System>(
  'systemModel', systemSchema, 'system');
export {SystemModel};
