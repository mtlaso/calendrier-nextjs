/**
 * Classe qui représente une erreure de type MiddlewareError
 */
export default class ApiError extends Error {
  private _statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg);

    this._statusCode = statusCode;
  }

  get statusCode(): number {
    return this._statusCode;
  }
}
