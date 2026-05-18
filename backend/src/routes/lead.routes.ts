import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/stats', leadController.getStats);

router.get(
  '/export',
  authorize(UserRole.ADMIN),
  leadController.exportCsv
);

router.get('/', leadController.getLeads);

router.post(
  '/',
  createLeadValidator,
  validate,
  leadController.createLead
);

router.get('/:id', leadController.getLeadById);

router.put(
  '/:id',
  updateLeadValidator,
  validate,
  leadController.updateLead
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  leadController.deleteLead
);

export default router;
