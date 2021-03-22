const express= require('express');
const tourController = require('./../Controller/tourController')

const router =  express.Router();

router.get('/top-5-cheap', tourController.topFiveTours,tourController.getAllTours)
router.get('/' , tourController.getAllTours)
router.post('/',tourController.createTour);
router.get('/:id',tourController.getTour)
router.patch('/:id', tourController.updateTour)
router.delete('/:id',tourController.deleteTour);

module.exports= router;