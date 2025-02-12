const router = require('express').Router();
const { holiDayController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator', 'Kepala Pegawai']), holiDayController.getAllHolidayController);
router.get('/:id',authorize(['Administrator', 'Kepala Pegawai']), holiDayController.getOneHolidayController);
router.post('/', authorize(['Administrator', 'Kepala Pegawai']), holiDayController.createHolidayController);
router.put('/:id', authorize(['Administrator', 'Kepala Pegawai']), holiDayController.updateHolidayController);
router.delete('/:id',authorize(['Administrator', 'Kepala Pegawai']), holiDayController.destroyHolidayController);

module.exports = router;