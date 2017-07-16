import c = require('config');
import {IConfig} from 'config';

export interface IConfigEx extends IConfig {
    isProduction: boolean;
    [key: string]: any;
}

class Config {
    public static get isProduction() {
        return process.env.NODE_ENV === 'production';
    }

    public static get<T>(name: string): T {
        return c.get<T>(name);
    }

    public static has(name: string): boolean {
        return c.has(name);
    }

}

const config: IConfigEx = Object.assign(Config, c);
export default config;
