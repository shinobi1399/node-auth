let passwordValidChars = 'abcdefghjkmnpqrsuvwxyzABCDEFGHJKMNOPQRSUVWXYZ2345689@#%&*&<>=';
let idValidChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
let hexValidChars = 'ABCDEF0123456789';

export class RandomGenerator {

  /**
   * returns a random integer between the specified values. The value is no lower than min
   * (or the next integer greater than min if min isn't an integer), and is less than (but not equal to) max.
   * @param min
   * @param max
   * @returns {any}
   */
  public static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  /**
   * generates a password of required length which could contain uppercase lowercase numbers and letters
   * and some puntuation chars.
   * Numbers and letters that look too similar are excluded eg i, l, 1
   * @param {number} length
   * @returns {string}
   */
  public static password(length: number): string {
    return RandomGenerator.getString(length, passwordValidChars);
  }

  public static getString(length: number, validChars: string): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      let index = RandomGenerator.getRandomInt(0, validChars.length);

      result += validChars[index];
    }
    return result;
  }

  public static id() {
    return RandomGenerator.getString(32, hexValidChars);
  }

  public static bigId() {
    return this.id() + this.id();
  }
}
