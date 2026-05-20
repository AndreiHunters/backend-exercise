import { ApiError } from '~/utils/ApiError';
import { logger } from '~/utils/logger';
import type { APIResponse } from '~/helpers/response.helper';

export class NotFoundError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  public readonly details?: unknown;
  constructor({ message, details }: { message: string; details?: unknown }) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class ForbiddenError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = 'ForbiddenError';
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

export class InternalError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = 'InternalError';
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
  if (error instanceof ValidationError) {
    return apiResponse.BadRequest({ message: error.message, details: error.details });
  }
  if (error instanceof ForbiddenError) {
    return apiResponse.Forbidden({ message: error.message });
  }
  if (error instanceof TooManyRequestsError) {
    return apiResponse.TooManyRequests({
      message: error.message,
      retryAfterSeconds: error.retryAfterSeconds
    });
  }
  if (error instanceof ApiError) {
    if (error.statusCode === 400)
      return apiResponse.BadRequest({ message: error.message, details: error.details });
    if (error.statusCode === 401) return apiResponse.Unauthorized({ message: error.message });
    if (error.statusCode === 403) return apiResponse.Forbidden({ message: error.message });
    if (error.statusCode === 404) return apiResponse.NotFound({ message: error.message });
    if (error.statusCode === 409) return apiResponse.Conflict({ message: error.message });
    return apiResponse.InternalServerError({ message: error.message });
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error({ tag: 'error', message, error: String(error) });
  return apiResponse.InternalServerError({ message: 'Internal Server Error' });
};
