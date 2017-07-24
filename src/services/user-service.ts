import * as m from 'mongoose';
import {User, UserModel} from '../model/user.model';
import {RandomGenerator} from '../common/utilities/RandomGenerator';
import {IdentityStoreModel} from '../model/identity-store.model';
import {mongoUtils} from '../common/data/mongo-utils';
import {System, SystemModel} from '../model/system.model';

export class UserService {
  async createUser(userDetails, identityStoreId?: m.Types.ObjectId): Promise<User> {
    //TODO: Think about validation
    if (!identityStoreId) {
      let system = <System> await SystemModel.findOne({});
      identityStoreId = system.identityStoreId;
    }

    let store = await IdentityStoreModel.findById(identityStoreId);
    if (!store) throw new Error('Identity store doess not exist: ' + identityStoreId);

    if (!userDetails.username) throw new Error('Username is required field');

    let userExists = await mongoUtils.contains(UserModel.collection,
      {username: userDetails.username, identityStoreId: identityStoreId});
    if (userExists) throw new Error('Username already taken');

    if (!userDetails.email) throw new Error('Email address does not exist');
    let emailExists = await mongoUtils.contains(UserModel.collection,
      {email: userDetails.email, identityStoreId: identityStoreId});
    if (emailExists) throw new Error('email address already used.');

    let mustChangePassword = false;
    if (!userDetails.password) {
      userDetails.password = RandomGenerator.password(10);
      mustChangePassword = true;
    }

    let newUser = {
      mustChangePassword: mustChangePassword,
      password: userDetails.password,
      username: userDetails.username,
      name: userDetails.name,
      email: userDetails.email,
      identityStoreId: identityStoreId
    };

    let userModel = new UserModel(newUser);
    await userModel.save();

    return userModel;
  }
}

export const userService = new UserService();
