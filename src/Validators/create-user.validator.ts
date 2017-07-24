import * as m from 'mongoose';
import {ValidationResultSet} from './ValidationResultSet';
import {UserModel} from '../model/user.model';

export class CreateUserValidator {
  async validate(details: CreateUserDetails): Promise<ValidationResultSet> {
    let resultSet = new ValidationResultSet();

    if (!details.username) {
      resultSet.results.push({status: 'Error', message: 'Username is required', code: 'J5H69A85'});
    }

    let userExists = await this.checkUsername(details.username, details.identityStoreId);
    if (userExists) resultSet.results.push({status: 'Error', message: 'user exists', code: 'J5H6LEW9'});
    return resultSet;
  }

  async checkUsername(username: string, identityStore: m.Types.ObjectId): Promise<boolean> {
    return await UserModel.userExists(username, identityStore);
  }
}

export interface CreateUserDetails {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  mustChangePassword: boolean;
  identityStoreId: m.Types.ObjectId;
}

export const createUserValidator = new CreateUserValidator();
