import * as m from 'mongoose';
import {Model} from 'mongoose';

/**
 * Setup mongoose model with schema. If the model has already been setup return the existing model
 * else create a new one.
 *
 * We do it this way because some test frameworks reset requires leading to the same model being registered
 * more than once causing ane rror
 * @param {string} modelName
 * @param {"mongoose".Schema} schema
 * @param {string} collection
 * @returns {"mongoose".Model<TInterface extends "mongoose".Document>}
 */
export function setupModel<TInterface extends m.Document>(modelName: string,
                                                          schema: m.Schema,
                                                          collection?: string): Model<TInterface> {
  if (!collection) {
    collection = modelName;
  }
  let modelExists = m.modelNames().some(name => name === modelName);
  if (modelExists) {
    return m.model<TInterface>(modelName);
  } else {
    return m.model<TInterface>(modelName, schema, collection);
  }
}

/**
 * Adds middleware to update addDate, editDate on save
 * @param {"mongoose".Schema} schema
 */
export function addAuditSaveMiddleware(schema: m.Schema) {
  schema.pre('save', function (next) {
    if (!this.addDate) this.addDate = new Date();
    this.editDate = new Date();

    next();
  });
}
