import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateAskJijiRequest } from '../middleware/validation';
import { searchResources, getAllResources } from '../services/resource.service';
import { generateMockedResponse } from '../services/response.service';
import { supabase } from '../config/supabase';
import { AskJijiRequest, AskJijiResponse } from '../types';

const router = Router();

router.post(
  '/ask-jiji',
  validateAskJijiRequest,
  async (req: Request, res: Response) => {
    try {
      const { query, userId } = req.body as AskJijiRequest;

      let resources = await searchResources(query);

      // If no matching resources, get any available resources
      if (resources.length === 0) {
        resources = await getAllResources();
      }

      const answer = generateMockedResponse(query);

      // Create query ID (in production, this would be saved to DB)
      const queryId = uuidv4();

      // Optionally save query to database (if userId provided)
      if (userId) {
        await supabase.from('queries').insert({
          id: queryId,
          user_id: userId,
          query_text: query,
          response_text: answer,
        });
      }

      const response: AskJijiResponse = {
        success: true,
        data: {
          answer,
          resources,
          queryId,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error processing query:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: 'Failed to process your query',
        },
      });
    }
  }
);

export default router;
