import type { Request, Response } from 'express';

export class APIResponse {
  private readonly _res: Response;

  constructor({ req: _req, res }: { req: Request; res: Response }) {
    this._res = res;
  }

  Success = ({ data }: { data: unknown }): Response => this._res.status(200).json(data);

  Created = ({ data }: { data: unknown }): Response => this._res.status(201).json(data);

  Accepted = ({ data }: { data: unknown }): Response => this._res.status(202).json(data);

  BadRequest = ({
    message,
    details
  }: {
    message: string;
    details?: unknown;
  }): Response =>
    this._res.status(400).json(details !== undefined ? { error: message, details } : { error: message });

  Unauthorized = ({ message }: { message: string }): Response =>
    this._res.status(401).json({ error: message });

  NotFound = ({ message }: { message: string }): Response =>
    this._res.status(404).json({ error: message });

  TooManyRequests = ({
    message,
    retryAfterSeconds
  }: {
    message: string;
    retryAfterSeconds: number;
  }): Response => {
    this._res.setHeader('Retry-After', String(retryAfterSeconds));
    return this._res.status(429).json({ error: message, retryAfter: retryAfterSeconds });
  };

  InternalServerError = ({ message }: { message: string }): Response =>
    this._res.status(500).json({ error: message });
}
