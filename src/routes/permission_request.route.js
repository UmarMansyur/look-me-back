const router = require('express').Router();
const { permissionRequestController } = require('../controller/index');
const authorize = require('../middleware/auth');
const upload = require('../utils/multer');

router.get('/', authorize(['Kepala Pegawai', 'Administrator', 'Pegawai']), permissionRequestController.getAllPermissionRequestController);
router.get('/:id', authorize(['Kepala Pegawai', 'Pegawai']), permissionRequestController.getOnePermissionRequestController);
router.patch('/:id', authorize(['Kepala Pegawai']), permissionRequestController.updateStatusPermissionRequestController);
router.post('/', authorize(['Pegawai']), upload.uploadImage().single('file'), permissionRequestController.createPermissionRequestController);
router.put('/:id', authorize(['Kepala Pegawai', 'Pegawai']), upload.uploadImage().single('file'), permissionRequestController.updatePermissionRequestController);
router.delete('/:id', authorize(['Kepala Pegawai', 'Pegawai']), permissionRequestController.destroyPermissionRequestController);

module.exports = router;