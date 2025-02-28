const express = require('express');
const authController = require('../controllers/auth')
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/register',authController.register)
router.post('/login', authController.login);
router.get('/dashboard', verifyToken, (req, res) => {
    res.render('dashboard', { user: req.user }); })

module.exports = router;

