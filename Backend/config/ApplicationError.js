export class ApplicationError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
  }
}
