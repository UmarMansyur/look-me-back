const router = require('express').Router();
const { blacklistController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai']), blacklistController.getAllController);
router.get('/:id', authorize(['Administrator', 'Kepala Pegawai']), blacklistController.getOneController);
router.post('/', authorize(['Administrator', 'Kepala Pegawaian']), blacklistController.createController);
router.put('/:id', authorize(['Administrator', 'Kepala Pegawaian']), blacklistController.updateController);
router.delete('/:id', authorize(['Administrator', 'Kepala Pegawaian']),blacklistController.destroyController);

module.exports = router;