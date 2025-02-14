const router = require('express').Router();
const { institutionController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), institutionController.getAllInstitutionController);
router.get('/:id', authorize(['Administrator']), institutionController.getOneInstitutionController);
router.post('/', authorize(['Administrator']), institutionController.createInstitutionController);
router.put('/:id', authorize(['Administrator']), institutionController.updateInstitutionController);
router.delete('/:id', authorize(['Administrator']), institutionController.destroyInstitutionController);

module.exports = router;