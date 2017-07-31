import * as m from 'mongoose';
import {ValidationResultSet} from './ValidationResultSet';
import {UserModel} from '../model/user.model';
import {IdentityStoreModel} from '../model/identity-store.model';

export class CreateUserValidator {
  async validate(details: CreateUserDetails): Promise<ValidationResultSet> {
    let resultSet = new ValidationResultSet();

    if (!details.username) {
      resultSet.results.push({status: 'Error', message: 'Username is required', code: 'J5H69A85'});
    }

    if (!details.password || details.password.length < 8) {
      resultSet.results.push({
        status: 'Error',
        message: 'password too short',
        code: 'J5LGF4RF'
      });
    }

    if (!details.email || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details.email) === false) {
      resultSet.results.push(
        {status: 'Error', message: 'Invalid email address', code: 'J5MURDBI'}
      );
    }

    let identityStoreExists = await this.identityStoreExists(details.identityStoreId);
    if (!identityStoreExists) {
      resultSet.results.push({
        status: 'Error',
        message: 'Identity store does not exist',
        code: 'J5LH0ZJJ'
      });
    }

    let userExists = await this.userExists(details.username, details.identityStoreId);
    if (userExists) resultSet.results.push({status: 'Error', message: 'user exists', code: 'J5H6LEW9'});

    return resultSet;
  }

  async identityStoreExists(identityStoreId: m.Types.ObjectId): Promise<boolean> {
    return await IdentityStoreModel.exists(identityStoreId);
  }

  async userExists(username: string, identityStore: m.Types.ObjectId): Promise<boolean> {
    return await UserModel.userExists(username, identityStore);
  }
}

export interface CreateUserDetails {
  username: string;
  name: string;
  password: string;
  email: string;
  mustChangePassword: boolean;
  identityStoreId: m.Types.ObjectId;
}

export const createUserValidator = new CreateUserValidator();
