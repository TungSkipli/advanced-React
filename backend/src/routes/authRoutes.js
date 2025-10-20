const express = require('express');
const router = express.Router();

const {authenticateUser} = require('../middleware/auth');
const { Register, Login, getUserProfile, updateUserProfile } = require('../controllers/authController');

router.post('/signUp', Register)
router.post('/login', Login)
router.use(authenticateUser);
router.get('/me', getUserProfile)
router.put('/me', updateUserProfile)

module.exports = router;