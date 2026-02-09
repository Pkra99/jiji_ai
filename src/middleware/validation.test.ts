import { Request, Response, NextFunction } from 'express';
import { validateAskJijiRequest } from './validation';

// Mock Express objects
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAskJijiRequest', () => {
    // Valid requests
    it('should pass validation for valid query', () => {
      const req = { body: { query: 'Explain RAG' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation with optional userId', () => {
      const req = { body: { query: 'Explain RAG', userId: 'user-123' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    // Missing query
    it('should reject missing query', () => {
      const req = { body: {} } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Query is required',
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // Invalid query types
    it('should reject null query', () => {
      const req = { body: { query: null } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject number as query', () => {
      const req = { body: { query: 12345 } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Query must be a string',
          }),
        })
      );
    });

    it('should reject array as query', () => {
      const req = { body: { query: ['a', 'b'] } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject object as query', () => {
      const req = { body: { query: { text: 'hello' } } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    // Length validation
    it('should reject query shorter than 2 characters', () => {
      const req = { body: { query: 'a' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Query must be at least 2 characters long',
          }),
        })
      );
    });

    it('should reject empty string query', () => {
      const req = { body: { query: '' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject whitespace-only query', () => {
      const req = { body: { query: '   ' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject query longer than 1000 characters', () => {
      const req = { body: { query: 'a'.repeat(1001) } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Query must not exceed 1000 characters',
          }),
        })
      );
    });

    it('should accept query exactly 1000 characters', () => {
      const req = { body: { query: 'a'.repeat(1000) } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    // Input sanitization
    it('should sanitize HTML tags from query', () => {
      const req = { body: { query: '<script>alert("xss")</script>Hello' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.body.query).not.toContain('<script>');
      expect(req.body.query).not.toContain('</script>');
    });

    it('should sanitize dangerous characters', () => {
      const req = { body: { query: 'Hello <world> "test" \'quoted\'' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.body.query).not.toContain('<');
      expect(req.body.query).not.toContain('>');
      expect(req.body.query).not.toContain('"');
      expect(req.body.query).not.toContain("'");
    });

    it('should trim whitespace from query', () => {
      const req = { body: { query: '  Hello World  ' } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.body.query).toBe('Hello World');
    });

    // UserId validation
    it('should reject non-string userId', () => {
      const req = { body: { query: 'Hello', userId: 12345 } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'userId must be a string',
          }),
        })
      );
    });

    // SQL injection-like patterns (should be sanitized, not rejected)
    it('should handle SQL injection attempts', () => {
      const req = { body: { query: "SELECT * FROM users; DROP TABLE users;--" } } as Request;
      const res = mockResponse();

      validateAskJijiRequest(req, res, mockNext);

      // Should pass (sanitization handles it, not rejection)
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
