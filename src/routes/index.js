const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/role', require('./role.route'));

module.exports = router;