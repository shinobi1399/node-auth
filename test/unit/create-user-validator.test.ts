import {CreateUserDetails, CreateUserValidator} from '../../src/Validators/create-user.validator';
import {ObjectID} from 'bson';
import {expect} from 'chai';
import * as sinon from 'Sinon';

describe('create user validator tests', async function () {
  let sut: CreateUserValidator;
  let createUserDetails: CreateUserDetails;
  beforeEach(function () {
    sut = new CreateUserValidator();
    sut.userExists = sinon.stub().returns(false);

    sut.identityStoreExists = sinon.stub().returns(true);
  });

  it('When valid user, validation passes', async function () {
    let user = createValidUser();

    let result = await sut.validate(user);

    expect(result.success).is.true;
  });

  it('when missing username, validation fails', async function () {
    let user = createValidUser();
    user.username = '';

    let result = await sut.validate(user);

    expect(result.success).is.false;
    expect(result.results.length).eq(1);
  });

  it('when username exists, validation fails', async function () {
    let user = createValidUser();
    user.username = 'exists';
    sut.userExists = sinon.stub().returns(true);

    let result = await sut.validate(user);

    expect(result.success).is.false;
    expect(result.results.length).eq(1);
  });

  it('when password too short, validation fails', async function () {
    let user = createValidUser();
    user.password = '1234567';

    let result = await sut.validate(user);

    expect(result.success).is.false;
  });

  it('when invalid identity store, validation fails', async function () {
    let user = createValidUser();
    sut.identityStoreExists = sinon.stub().returns(Promise.resolve(false));

    let result = await sut.validate(user);

    expect(result.success).is.false;
  });

  it('when blank email address, validation fails', async function () {
    let user = createValidUser();
    user.email = '';
    let result = await sut.validate(user);

    expect(result.success).is.false;
  });

  it('when invalid email address, validation fails', async function () {
    let user = createValidUser();
    user.email = 'email@@gmail.com';
    let result = await sut.validate(user);

    expect(result.success).is.false;
  });

});

function createValidUser(): CreateUserDetails {
  let createUserDetails: CreateUserDetails = {
    username: 'username',
    name: 'name',
    password: '12345678',
    identityStoreId: new ObjectID(1),
    email: 'email@gmail.com',
    mustChangePassword: false,
  };
  return createUserDetails;
}
