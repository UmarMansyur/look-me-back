const router = require('express').Router();
const { warningLetterController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.getAllWarningLetterController);
router.get('/pegawai', authorize(['Pegawai']), warningLetterController.getAllWarningLetterController);
router.get('/data/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), warningLetterController.getOneWarningLetterController);
router.post('/', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.createWarningLetterController);
router.put('/:id', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.updateWarningLetterController);
router.delete('/:id', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.destroyWarningLetterController);

module.exports = router;