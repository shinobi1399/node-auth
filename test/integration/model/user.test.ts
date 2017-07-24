import {setupTestMongoDb} from '../common/mongo.common';
import {Db} from 'mongodb';
import {User, UserBase, UserModel} from '../../../src/model/user.model';
import {expect} from 'chai';
import {IdentityStoreBuilder} from './identity-store.test';
import {ObjectID} from 'bson';

describe('user model tests', async function () {
  let db: Db;
  let sut: User;

  async function setup() {
    db = await setupTestMongoDb();
    sut = await UserBuilder.createDbUser();
  }

  describe('[usernameExists tests]', async function () {
    it('when user exists, returns true', async function () {
      await setup();

      let result = await UserModel.userExists(sut.username, sut.identityStoreId);

      expect(result).is.true;
    });

    it('when user does not exist, returns false', async function () {
      await setup();

      let result = await UserModel.userExists('abc', sut.identityStoreId);

      expect(result).is.false;
    });
  });

  it('get user', async function () {
    await setup();
    let user = <User> await UserModel.findById(sut._id);

    expect(user).does.exist;
    expect(user).is.instanceOf(UserModel);
    expect(user.username, 'username').eq(sut.username);
    expect(user.name, 'username').eq(sut.name);
    expect(user.email, 'email').eq(sut.email);
    expect(user.emailVerified, 'email verified').eq(sut.emailVerified);
    expect(user.password, 'password').eq(sut.password);
    expect(user.apiKey, 'apikey').eq(sut.apiKey);
    expect(user.userMetadata, 'user meta').eql(sut.userMetadata);
    expect(user.appMetadata, 'app meta').eql(sut.appMetadata);
    expect(user.identityStoreId, 'user identity store').eql(sut.identityStoreId);
    expect(user.addDate, ' addDate').eql(sut.addDate);
    expect(user.editDate, 'editDate').eql(sut.editDate);

  });

});

export class UserBuilder {
  constructor() {
  }

  public static async createDbUser(): Promise<User> {
    let store = IdentityStoreBuilder.createIdentityStore();
    await store.save();

    let user = new UserModel(UserBuilder.user());
    user.identityStoreId = store._id;

    await user.save();

    return user;
  }

  public static user(): UserBase {
    return {
      username: 'username',
      name: 'name',
      email: 'email@email.email',
      emailVerified: true,
      password: 'password',
      apiKey: 'api key',
      disabled: true,
      userMetadata: {user: true},
      appMetadata: {app: true},
      mustChangePassword: true,
      identityStoreId: new ObjectID(Date.now()),

      addDate: new Date(),
      editDate: new Date(),
    };
  }
}

