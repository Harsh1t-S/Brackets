/**
 * An expected, client-facing error with an HTTP status code. Throw this from
 * services/controllers for domain failures (bad credentials, duplicate email,
 * not found) so the central error handler can map them to the right status
 * without each controller re-implementing try/catch.
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
