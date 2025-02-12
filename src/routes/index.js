const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/role', require('./role.route'));
router.use('/holiday', require('./holiday.route'));
router.use('/operating-hours', require('./operating_hours.route'));
router.use('/institution', require('./institution.route'));
router.use('/blacklist', require('./blacklist.route'));
router.use('/permission-request', require('./permission_request.route'));
router.use('/warning-letter', require('./warning_letter.route'));
router.use('/attendance', require('./attendance.route'));

module.exports = router;