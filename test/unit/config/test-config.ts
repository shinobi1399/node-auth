import {expect} from 'chai';
import config from '../../../src/common/config/config';

describe('config tests', function () {
    beforeEach(function () {
    });
    it('config env path defined', function () {
        expect(!!process.env.NODE_CONFIG_DIR).true;
    });
    it('when env = production, config.isProduction is true', () => {
        process.env.NODE_ENV = 'production';

        expect(config.isProduction).eq(true, 'isProduction');
    });

    it('when env != production, isProduction is false', function () {
        process.env.NODE_ENV = 'dev';

        expect(config.isProduction).eq(false, 'isProduction');
    });

    it('can read config value by key', function () {
        let value = config.get('say');

        expect(value).eq('hello world', 'value');
    });

    it('can read config value from section', function () {
        let value = config.get<any>('nested');

        expect(value.say).eq('hello nested');
    });

    it('can read config section', function () {
        let result = config.has('nested');

        expect(result).true;
    });

    it('can read value directly from from config property', function () {
        let result = config.say;

        expect(result).eq('hello world');
    });
    it('can determine if key exists', function () {
        let result = config.has('na');

        expect(result).false;
    });
});
