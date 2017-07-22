import * as b from 'bcrypt';

export class HashUtils {
  public async hash(data: string): Promise<string> {
    return await b.hash(data, 12);
  }

  public async verify(data: string, hash: string): Promise<boolean> {
    return await b.compare(data, hash);
  }
}

export const hashUtils = new HashUtils();
