export class ValidationResultSet {
  results: ValidationResult[] = [];

  public get success() {
    return this.results.length === 0;
  }

  public add(result: ValidationResult): ValidationResultSet {
    this.results.push(result);
    return this;
  }
}

export interface ValidationResult {
  status: 'Warning' | 'Error';
  code: string;
  message: string;
}
