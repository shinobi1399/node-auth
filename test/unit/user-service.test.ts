import {UserService} from '../../src/services/user-service';
import * as sinon from 'Sinon';
import {User} from '../../src/model/user.model';
import {expect, use as chaiUse} from 'chai';
import {SinonStub} from 'sinon';
import * as mongoose from 'mongoose';
import {ValidationResultSet} from '../../src/Validators/ValidationResultSet';
import {any} from '../utils';

chaiUse(require('chai-as-promised'));

describe('User service tests', async function () {
  let sut: UserService;
  let user: User = <any> {};
  beforeEach(function () {
    sut = new UserService();
    (<any>sut).save = sinon.stub();
    (<any> sut).validate = sinon.stub().returns({success: true});
    (<any>sut).setIdentityStore = sinon.stub();
    any(sut).hashPassword = sinon.stub().returns('hashed');
  });

  describe('create  user tests', async function () {
    it('when no identity store specified, set default identity store', async function () {

      await sut.createUser(user);

      expect((<SinonStub>(<any>sut).setIdentityStore).called);
    });

    it('when identity store specified, dont default identity store', async function () {

      user.identityStoreId = mongoose.Types.ObjectId();
      await sut.createUser(user);

      expect((<SinonStub> (<any>sut).setIdentityStore).notCalled);
    });

    it('when no password specified, generate password and set must change password to true', async function () {

      await sut.createUser(user);

      expect(user.password).is.ok;
      expect(user.mustChangePassword).to.be.true;
    });

    it('Hash password', async function () {
      (<any>sut).hashPassword = sinon.stub().returns('hashed');
      let spy: SinonStub = any(sut).save;
      user.password = 'abc';

      let returnedUser = await sut.createUser(user);

      expect(spy.lastCall.args[0].password).eq('hashed');
    });

    it('when password specified, dont generate password', async function () {
      user.password = 'password';
      user.mustChangePassword = false;

      await sut.createUser(user);

      expect(user.password).eq('password');
      expect(user.mustChangePassword).to.be.false;
    });

    it('when validation error, raise exception and do not save user', async function () {
      any(sut).validate = sinon.stub().returns(Promise.resolve(
        new ValidationResultSet().add({status: 'Error', code: '', message: ''})));

      let p = sut.createUser(user);
      expect(p).to.eventually.be.rejected;
    });

    it('saves user record', async function () {
      await sut.createUser(user);

      expect((<SinonStub>any(sut).save).called);
    });

  });

  describe('update user tests', async function () {
    it('', async function () {

    });

  });

});
