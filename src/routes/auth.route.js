const router = require('express').Router();
const { authController } = require('../controller');
const authorize = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

router.get('/profile/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.getMeController);
router.get('/me', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.getMeController);
router.post('/login', authController.loginController);
router.post('/register', upload.single('thumbnail'), authorize(['Administrator', 'Kepala Pegawai']), authController.registerController);
router.post('/forgot-password', authController.forgotPasswordController);
router.post('/refresh-token', authController.refreshTokenController);
router.patch('/toggle-edit/:id', authorize(['Administrator']), authController.toggleEditController);
router.patch('/update-account/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateAccountController);
router.patch('/update-face-id/:id', authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateDescriptionController);
router.patch('/update-profile/:id', upload.single('thumbnail'), authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateProfileController);
router.patch('/update-thumbnail/:id', upload.single('thumbnail'), authorize(['Administrator', 'Kepala Pegawai', 'Pegawai']), authController.updateThumbnailController);
router.delete('/delete/:id', authorize(['Administrator']), authController.deleteUserController);
   
module.exports = router;