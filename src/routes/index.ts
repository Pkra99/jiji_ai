import { Router, Request, Response } from 'express';
import jijiRoutes from './jiji.routes';
import { HealthResponse } from '../types';
import { getServiceClient } from '../config/supabase';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// Debug endpoint - remove in production
router.get('/debug/resources', async (_req: Request, res: Response) => {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('resources')
      .select('*');
    
    res.json({
      success: !error,
      error: error?.message || null,
      count: data?.length || 0,
      data: data
    });
  } catch (err) {
    res.json({ success: false, error: String(err) });
  }
});

// Mount Jiji routes
router.use('/', jijiRoutes);

export default router;

