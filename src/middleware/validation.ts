import { Request, Response, NextFunction } from 'express';
import { AskJijiRequest } from '../types';

// Input sanitization: remove potential XSS and trim whitespace
const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, ''); // Remove dangerous characters
};

// Validate /ask-jiji request
export const validateAskJijiRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as AskJijiRequest;

  // Check if query exists
  if (!body.query) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query is required',
      },
    });
  }

  // Check if query is a string
  if (typeof body.query !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query must be a string',
      },
    });
  }

  // Check minimum length
  if (body.query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query must be at least 2 characters long',
      },
    });
  }

  // Check maximum length
  if (body.query.length > 1000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query must not exceed 1000 characters',
      },
    });
  }

  // Sanitize input
  req.body.query = sanitizeString(body.query);

  // Optional: validate userId if provided
  if (body.userId && typeof body.userId !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'userId must be a string',
      },
    });
  }

  next();
};
