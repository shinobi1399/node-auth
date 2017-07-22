import * as m from 'mongoose';
import {addAuditSaveMiddleware, setupModel} from '../common/data/model-utils';

/**
 * A identity store for users.
 * Multiple stores can be setup and used to setup separate user bases for different apps.
 */
export interface User extends m.Document {
  username: string;
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  apiKey: string;
  disabled: boolean;
  userMetadata: object;
  appMetadata: object;
  mustChangePassword: boolean;
  identityStoreId: m.Types.ObjectId;

  addDate?: Date;
  editDate?: Date;
}

let userSchema = new m.Schema(
  {
    username: {type: String},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    hashAlgorithm: {type: String},
    emailVerified: {type: Boolean},
    disabled: {type: Boolean},
    userMetadata: {type: m.SchemaTypes.Mixed},
    appMetadata: {type: m.SchemaTypes.Mixed},

    addDate: {type: Date},
    editDate: {type: Date}
  });

addAuditSaveMiddleware(userSchema);

export const UserModel = setupModel<User>(
  'userModel', userSchema, 'Users');
