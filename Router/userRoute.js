const express= require('express');
const userController = require('./../Controller/userController');
const authController = require('./../Controller/authContorller')

const router = express.Router();

router.post('/signup', authController.signup)

router.get('/' ,userController.getAllUsers);
router.post('/' , userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports= router ;
