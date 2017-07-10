import {expect} from 'chai';
describe('hello world test', () => {
    it('should say hello', () => {
        let hello = 'hello world';

        expect(hello).equal('hello world', 'should say hello');
    });
});
