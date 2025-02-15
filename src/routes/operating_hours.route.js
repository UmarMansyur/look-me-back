const router = require('express').Router();
const { operatingHoursController } = require('../controller/index');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Kepala Pegawai']), operatingHoursController.getAllOperatingHoursController);
router.get('/:id', authorize(['Kepala Pegawai']), operatingHoursController.getOneOperatingHoursController);
router.post('/', authorize(['Kepala Pegawai']), operatingHoursController.createOperatingHoursController);
router.put('/:id', authorize(['Kepala Pegawai']), operatingHoursController.updateOperatingHoursController);
router.patch('/:id', authorize(['Kepala Pegawai']), operatingHoursController.changeStatusController);
router.delete('/:id', authorize(['Kepala Pegawai']), operatingHoursController.destroyOperatingHoursController);

module.exports = router;