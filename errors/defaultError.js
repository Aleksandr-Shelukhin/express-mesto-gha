class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
