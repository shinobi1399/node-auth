export class ValidationResultSet {
  results: ValidationResult[] = [];

  public get success() {
    return this.results.length === 0;
  }

}

export interface ValidationResult {
  status: 'Warning' | 'Error';
  code: string;
  message: string;
}
