import * as m from 'mongoose';
import {addAuditSaveMiddleware, setupModel} from '../common/data/model-utils';

/**
 * A identity store for users.
 * Multiple stores can be setup and used to setup separate user bases for different apps.
 */
export interface IdentityStore extends m.Document {
  name: string;
  description: string;
  addDate?: Date;
  editDate?: Date;
}

export interface IdentityStoreModelEx extends m.Model<IdentityStore> {
  exists(objectId: m.Types.ObjectId): boolean;
}

let identityStoreSchema = new m.Schema(
  {
    name: {type: String},
    description: {type: String},
    addDate: {type: Date},
    editDate: {type: Date}
  });

addAuditSaveMiddleware(identityStoreSchema);

let IdentityStoreModel: IdentityStoreModelEx;

identityStoreSchema.static('exists', async function (id: m.Types.ObjectId) {
  let obj = await IdentityStoreModel.findById(id);

  return !!obj;
});

IdentityStoreModel = <IdentityStoreModelEx> setupModel<IdentityStore>(
  'IdentityStoreModel', identityStoreSchema, 'identity-stores');

export {IdentityStoreModel};
