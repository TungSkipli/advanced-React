const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateUser } = require('../middleware/auth');

router.post('/createCourse', authenticateUser, courseController.createCourse);

module.exports = router;