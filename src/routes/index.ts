import { Router, Request, Response } from 'express';
import jijiRoutes from './jiji.routes';
import { HealthResponse } from '../types';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// Mount Jiji routes
router.use('/', jijiRoutes);

export default router;
