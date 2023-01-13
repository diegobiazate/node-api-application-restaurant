import { Router } from 'express';

import * as RestaurantController from '../controllers/restaurantController';

const router = Router();

router.get('/listAll', RestaurantController.listAll);
router.get('/find', RestaurantController.findByName);
router.post('/create', RestaurantController.createNewRestaurant);
router.put('/edit', RestaurantController.updateRestaurant);
router.delete('/delete', RestaurantController.deleteRestaurant);

export default router;