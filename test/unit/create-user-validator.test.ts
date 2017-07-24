import {CreateUserDetails, createUserValidator} from '../../src/Validators/create-user.validator';
import {ObjectID} from 'bson';
import {expect} from 'chai';
import * as sinon from 'Sinon';

describe('create user validator tests', async function () {
  let sut = createUserValidator;
  let createUserDetails: CreateUserDetails;

  async function setup() {
    createUserDetails = {
      username: 'username',
      name: 'name',
      password: 'password',
      identityStoreId: new ObjectID(1),
      email: 'email@email.email',
      mustChangePassword: false,
      confirmPassword: 'password'
    };
  }

  it('When valid user, validation passes', async function () {
    await setup();

    let result = await validate();

    expect(result.success).is.true;
  });

  it('when missing username, validation fails', async function () {
    await setup();
    createUserDetails.username = '';

    let result = await validate();

    expect(result.success).is.false;
    expect(result.results.length).eq(1);
  });

  it('when username exists, validation fails', async function () {
    await setup();
    createUserDetails.username = 'exists';
    sut.checkUsername = sinon.stub().returns(true);
    let result = await validate();

    expect(result.success).is.false;
    expect(result.results.length).eq(1);
  });

  async function validate() {
    let result = await sut.validate(createUserDetails);
    return result;
  }
});
