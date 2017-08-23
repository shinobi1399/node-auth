import * as mongoose from 'mongoose';
import {addAuditSaveMiddleware, setupModel} from '../common/data/model-utils';
import {RandomGenerator} from '../common/utilities/RandomGenerator';

/**
 * A identity store for users.
 * Multiple stores can be setup and used to setup separate user bases for different apps.
 */
export interface UserBase {
  username: string;
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  apiKey: string;
  disabled: boolean;
  userMetadata: any;
  appMetadata: any;
  mustChangePassword: boolean;
  identityStoreId: mongoose.Types.ObjectId;

  addDate?: Date;
  editDate?: Date;
}

/**
 * Combines the user model and mongoose base interfaces together.
 */
export interface User extends UserBase, mongoose.Document {

}

let userSchema = new mongoose.Schema(
  {
    username: {type: String},
    name: {type: String, default: ''},
    email: {type: String},
    password: {type: String, default: () => RandomGenerator.password(8)},
    emailVerified: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    userMetadata: {type: mongoose.SchemaTypes.Mixed, default: {}},
    appMetadata: {type: mongoose.SchemaTypes.Mixed, default: {}},
    mustChangePassword: {type: Boolean, default: false},
    identityStoreId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    addDate: {type: Date},
    editDate: {type: Date}
  });
addAuditSaveMiddleware(userSchema);

export interface UserModelEx extends mongoose.Model<User> {
  userExists(username: string, store: mongoose.Types.ObjectId): boolean;
}

let UserModel: UserModelEx;

userSchema.static('userExists', async function (username: string, store: mongoose.Types.ObjectId): Promise<boolean> {
  let result = await UserModel.findOne({username: username, identityStoreId: store}, {_id: 1});
  return !!result;
});

UserModel = <UserModelEx> setupModel<User>(
  'userModel', userSchema, 'users');

export {UserModel};

