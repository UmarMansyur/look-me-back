const authorize = require('../middleware/auth');
const { dashboardController } = require('../controller/index')
const router = require('express').Router();

router.get('/admin', authorize(['Administrator']), dashboardController.getAdminDashboard);
router.get('/institution', authorize(['Kepala Pegawai']), dashboardController.getInstitutionDashboard);
module.exports = router;