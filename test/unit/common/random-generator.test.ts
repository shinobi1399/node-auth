import {RandomGenerator} from '../../../src/common/utilities/RandomGenerator';
import {expect} from 'chai';

describe('random generator tests', function () {
  it('get random number', function () {
    for (let i = 0; i < 10; i++) {
      let result = RandomGenerator.getRandomInt(0, 10);
      expect(result).is.gte(0).and.lte(9);
    }
  });

  it('generate 1 char password', function () {
    let result = RandomGenerator.password(1);
    expect(result).length(1);
  });

  it('generate unique passwords', function () {
    let result = RandomGenerator.password(32);
    let result2 = RandomGenerator.password(32);
    expect(result).to.not.eq(result2);
  });

  it('generate base16 id ', function () {
    let result = RandomGenerator.id();

    expect(result).length(32);
  });

  it('generate unique base16 id', function () {
    expect(RandomGenerator.id()).to.not.equal(RandomGenerator.id());
  });

  it('generate unique base16 long id', function () {
    let id = RandomGenerator.bigId();
    expect(id.length).eq(64);
  });


});
