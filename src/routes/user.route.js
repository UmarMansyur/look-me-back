const router = require('express').Router();
const { authController } = require('../controller');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.getAllUserController);
router.get('/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.getOneUserController);

module.exports = router;
