const router = require('express').Router();
const { createRoleController, updateRoleController, destroyRoleController, getAllRoleController, getOneRoleController } = require('../controller/role.controller');
const authorize = require('../middleware/auth');

router.get('/', authorize(['Administrator']), getAllRoleController);
router.get('/:id', authorize(['Administrator']), getOneRoleController);
router.post('/', authorize(['Administrator']), createRoleController);
router.put('/:id', authorize(['Administrator']), updateRoleController);
router.delete('/:id', authorize(['Administrator']), destroyRoleController);


module.exports = router;