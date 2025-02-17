const router = require('express').Router();
const { permissionRequestController } = require('../controller/index');
const authorize = require('../middleware/auth');
const upload = require('../utils/multer');

router.get('/', authorize(['Kepala Pegawai', 'Administrator', 'Pegawai']), permissionRequestController.getAllPermissionRequestController);
router.get('/validation', authorize(['Kepala Pegawai', 'Administrator', 'Pegawai']), permissionRequestController.getValidationPermissionRequestController);
router.get('/my-request', authorize(['Pegawai']), permissionRequestController.getMyPermissionRequestController);
router.get('/attendance/:id', authorize(['Kepala Pegawai', 'Pegawai']), permissionRequestController.getOnePermissionRequestController);
router.patch('/:id', authorize(['Kepala Pegawai', 'Administrator']), permissionRequestController.updateStatusPermissionRequestController);
router.post('/', authorize(['Pegawai']), upload.uploadImage().single('file'), permissionRequestController.createPermissionRequestController);
router.put('/:id', authorize(['Kepala Pegawai', 'Pegawai']), upload.uploadImage().single('file'), permissionRequestController.updatePermissionRequestController);
router.delete('/:id', authorize(['Kepala Pegawai', 'Pegawai']), permissionRequestController.destroyPermissionRequestController);

module.exports = router;