const router = require('express').Router();
const { authController } = require('../controller');
const authorize = require('../middleware/auth');
const { uploadImage } = require('../utils/multer');

router.post('/login', authController.loginController);
router.post('/register', uploadImage.single('thumbnail'), authorize(['Administrator', 'Kepala Pegawai']), authController.registerController);
router.delete('/delete/:id', authorize(['Administrator']), authController.deleteUserController);
router.patch('/toggle-edit/:id', authorize(['Administrator']), authController.toggleEditController);
router.patch('/update-account/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateAccountController);
router.patch('/update-description/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateDescriptionController);
router.patch('/update-profile/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateProfileController);
router.patch('/update-thumbnail/:id', uploadImage.single('thumbnail'), authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateThumbnailController);
router.get('/profile/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.getMeController);
router.post('/refresh-token', authController.refreshTokenController);
   
module.exports = router;