import { logger } from '~/utils/logger';
import type { APIResponse } from '~/helpers/response.helper';

export class NotFoundError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TooManyRequestsError extends Error {
  public readonly retryAfterSeconds: number;
  constructor({ message, retryAfterSeconds }: { message: string; retryAfterSeconds: number }) {
    super(message);
    this.name = 'TooManyRequestsError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export const handleApiError = ({
  apiResponse,
  error
}: {
  apiResponse: APIResponse;
  error: unknown;
}) => {
  if (error instanceof NotFoundError) {
    return apiResponse.NotFound({ message: error.message });
  }
  if (error instanceof TooManyRequestsError) {
    return apiResponse.TooManyRequests({
      message: error.message,
      retryAfterSeconds: error.retryAfterSeconds
    });
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error({ tag: 'error', message, error: String(error) });
  return apiResponse.InternalServerError({ message: 'Internal Server Error' });
};
