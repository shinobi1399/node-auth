import {User, UserBase, UserModel} from '../model/user.model';
import {RandomGenerator} from '../common/utilities/RandomGenerator';
import {SystemModel} from '../model/system.model';
import {CreateUserDetails, createUserValidator} from '../Validators/create-user.validator';
import {ValidationError} from '../Validators/validation-error';
import {ValidationResultSet} from '../Validators/ValidationResultSet';

export class UserService {
  async createUser(userDetails: CreateUserDetails): Promise<User> {
    if (!userDetails.password) {
      userDetails.password = RandomGenerator.password(10);
      userDetails.mustChangePassword = true;
    }

    if (!userDetails.identityStoreId) {
      await this.setIdentityStore(userDetails);
    }

    let validationResult = await this.validate(userDetails);
    if (!validationResult.success) {
      throw new ValidationError(validationResult, 'Validation errors occurred.');
    }

    let newUser: UserBase = {
      mustChangePassword: userDetails.mustChangePassword,
      password: userDetails.password,
      username: userDetails.username,
      name: userDetails.name,
      email: userDetails.email,
      identityStoreId: userDetails.identityStoreId,
      emailVerified: false,
      apiKey: RandomGenerator.base16Id(),
      appMetadata: {},
      userMetadata: {},
      disabled: false
    };

    let userModel = await this.save(newUser);

    return userModel;
  }

  public async setIdentityStore(userDetails: CreateUserDetails) {
    let system = await SystemModel.get();
    userDetails.identityStoreId = system.identityStoreId;
  }

  public async save(user: UserBase): Promise<User> {
    let userModel = new UserModel(user);
    return await userModel.save();
  }

  public async validate(userDetails: CreateUserDetails): Promise<ValidationResultSet> {
    let validationResult = await createUserValidator.validate(userDetails);
    return validationResult;
  }
}

export const userService = new UserService();
