import {getLogger, LoggingConfig, LoggingManager} from '../../src/logging/logging';
import {expect} from 'chai';

describe('logging config tests', function () {
    describe('get logger tests', function () {
        it('logging message should not throw exception', function () {
            getLogger().info('test');
        });

    });
    describe('create tests', function () {
        it('when file and console logging enabled, should create 2 transports', function () {
            let config = createConfig();
            config.useFile = true;
            config.useConsole = true;

            let logger = LoggingManager.create(config);

            expect(Object.keys(logger.transports).length).eq(2, 'should be 2 transports');
        });

        it('when only file enabled, should create 1 transports', function () {
            let config = createConfig();
            config.useFile = true;
            config.useConsole = false;

            let logger = LoggingManager.create(config);

            expect(Object.keys(logger.transports).length).eq(1, 'should be 1 transports');
        });

        it('when null passed to create, throws exception', function () {
            expect(() => LoggingManager.create(<any>null)).to.throw('Invalid logging config');
        });

        it('when invalid config passed to create, throws exception', function () {
            expect(() => LoggingManager.create(<any>{})).to.throw('Invalid logging config');
        });

        it('when only console enabled, should create 1 transports', function () {
            let config = createConfig();
            config.useFile = false;
            config.useConsole = true;

            let logger = LoggingManager.create(config);

            expect(Object.keys(logger.transports).length).eq(1, 'should be 1 transports');
        });
    });
});

function createConfig() {
    let config: LoggingConfig = {
        minLevel: 'info',
        useConsole: true,
        useFile: true,
        fileOptions: {filename: 'test.tst'}
    };
    return config;
}
