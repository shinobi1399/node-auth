import {hashUtils} from '../../../src/common/security/hash-utils';
import {expect} from 'chai';

describe('hash utils tests', function () {
  it('hash different from source', async function () {
    let result = await hashUtils.hash('password');
    expect(result).is.not.eq('password');
  });
  it('hashing different values generates different hash', async function () {
    let hash1 = await hashUtils.hash('password');
    let hash2 = await hashUtils.hash('password2');

    expect(hash1).to.not.equal(hash2);
  });

  it('hashing the same value should result in a different hash', async function () {
    let hash1 = await hashUtils.hash('p');
    let hash2 = await hashUtils.hash('p');

    expect(hash1).to.not.equal(hash2);
  });
});
