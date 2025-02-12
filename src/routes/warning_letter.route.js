const router = require('express').Router();
const { warningLetterController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.getAllWarningLetterController);
router.get('/:id', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.getOneWarningLetterController);
router.post('/', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.createWarningLetterController);
router.put('/:id', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.updateWarningLetterController);
router.delete('/:id', authorize(['Administrator', 'Kepala Pegawai']), warningLetterController.destroyWarningLetterController);

module.exports = router;