type AxiosLikeError = { response?: { data?: { message?: string } } };

/** True when the request never reached the server (network/timeout/CORS). */
export function isNetworkError(err: unknown): boolean {
  return (
    !!err && typeof err === "object" && !(err as AxiosLikeError).response
  );
}

/**
 * Best-effort user-facing message from an axios-style error: the server's
 * message when there is one, a connection hint on network failure, otherwise
 * the provided fallback.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (isNetworkError(err)) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  const e = err as AxiosLikeError;
  return e?.response?.data?.message ?? fallback;
}
