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

let identityStoreSchema = new m.Schema(
  {
    name: {type: String},
    description: {type: String},
    addDate: {type: Date},
    editDate: {type: Date}
  });

addAuditSaveMiddleware(identityStoreSchema);

export const IdentityStoreModel = setupModel<IdentityStore>(
  'IdentityStoreModel', identityStoreSchema, 'identity-stores');
