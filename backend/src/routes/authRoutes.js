const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth');
const { 
    register, 
    login, 
    getUserProfile, 
    updateUserProfile 
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.use(authenticateUser);
router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);

module.exports = router;