import {ValidationResultSet} from './ValidationResultSet';

export class ValidationError extends Error {

  constructor(public validationResult: ValidationResultSet, message: string) {
    super(message);
  }
}
