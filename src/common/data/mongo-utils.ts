import {Collection} from 'mongodb';

export class MongoUtils {
  /**
   *
   * @param {Collection<any>} collection
   * @param query
   * @returns {Promise<boolean>}
   */
  public async contains(collection: Collection<any>, query: any): Promise<boolean> {
    let cursor = await collection.find(query).project({_id: 1}).limit(1);

    let result = await cursor.hasNext();
    await cursor.close();
    return result;
  }
}

export const mongoUtils = new MongoUtils();
