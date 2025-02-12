const router = require('express').Router();
const { createRoleController, updateRoleController, destroyRoleController, getAllRoleController, getOneRoleController } = require('../controller/role.controller');

router.get('/', getAllRoleController);
router.get('/:id', getOneRoleController);
router.post('/', createRoleController);
router.put('/:id', updateRoleController);
router.delete('/:id', destroyRoleController);


module.exports = router;