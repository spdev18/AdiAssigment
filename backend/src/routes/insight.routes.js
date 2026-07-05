import { Router } from 'express';
import { getInsights, getFilterOptions, getStats } from '../controllers/insight.controller.js';

const router = Router();

router.get('/', getInsights);
router.get('/filters', getFilterOptions);
router.get('/stats', getStats);

export default router;
