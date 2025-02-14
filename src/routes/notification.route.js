const router = require('express').Router();
const { notificationController } = require('../controller');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), notificationController.getAllController);
router.put('/read-all', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), notificationController.readAllController);
router.put('/read/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), notificationController.readOneController);

module.exports = router;