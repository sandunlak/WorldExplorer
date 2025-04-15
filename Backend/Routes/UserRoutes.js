const express = require('express');
const router = express.Router();
const { login, register, logout, checkAuth } = require('../Controllers/UserController');
const upload = require('../Middleware/multerConfig');

router.post('/login', login);
router.post('/register', upload.single('photo'), register);
router.post('/logout', logout);
router.get('/check-auth', checkAuth);

module.exports = router;