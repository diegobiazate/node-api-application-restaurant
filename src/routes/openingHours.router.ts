import { Router } from 'express';

import * as OpeningHoursController from '../controllers/openingHoursController';

const router = Router();

router.get('/list', OpeningHoursController.listAll);
router.get('/findByIdRestaurant', OpeningHoursController.findByIdRestaurant);
router.get('/isOpen', OpeningHoursController.isOpen);
router.post('/create', OpeningHoursController.createOpeningHours);
router.put('/edit', OpeningHoursController.editOpeningHours);
router.delete('/delete', OpeningHoursController.deleteOpeningHours);

export default router;