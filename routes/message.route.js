const express = require('express');
const protectRoute = require('../middlewares/auth.middleware')
const router = express.Router();


router.get('/users', protectRoute, getUserForSidebar )