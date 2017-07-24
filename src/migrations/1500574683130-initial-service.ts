import {Migration} from '../common/data/mongo-migrate';
import {Db} from 'mongodb';
import {getLogger} from '../common/logging/logging';
import {RandomGenerator} from '../common/utilities/RandomGenerator';
import {hashUtils} from '../common/security/hash-utils';

export class InitialSetup implements Migration {
  public timestamp = 1500574683130;
  public description = 'Setup default identity store';

  constructor() {
  }

  async apply(db: Db) {
    let identityStore = db.collection('identity-stores');
    let store: any = {name: 'System identity store', description: ''};
    await identityStore.insertOne(store);
    getLogger().info(`Created default identity store with id ${store._id}`);

    let systemCollection = db.collection('system');
    let system = {identityStoreId: store._id};
    await systemCollection.insertOne(system);
    getLogger().info(`Created system with id ${store._id}`);

    let userCollection = db.collection('users');
    let password = RandomGenerator.password(20);
    let passwordHash = await hashUtils.hash(password);
    getLogger().info(`admin user password is ${password}`);

    let user =
      {
        username: 'admin',
        name: 'Default admin',
        email: 'no@email.localhost',
        emailVerified: false,
        password: passwordHash,
        apiKey: RandomGenerator.base16Id(),
        mustChangePassword: false,
        disabled: false,
        userMetadata: {},
        appMetadata: {},
        identityStoreId: store._id
      };
    await userCollection.insertOne(user);
  }

}
