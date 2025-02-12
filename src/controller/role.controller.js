const {
  create,
  update,
  getOne,
  getAll,
  destroy,
} = require("../services/role.service");

const { success } = require('../utils/response.handler');

const createRoleController = async (req, res, next) => {
  try {
    const data = await create(req);
    return success(res, data, "Role berhasil dibuat!", 201);
  } catch (error) {
    next(error);
  }
};

const updateRoleController = async (req, res, next) => {
  try {
    const data = await update(req);
    return success(res, data, "Role berhasil diubah!", 200);
  } catch (error) {
    next(error);
  }
};

const getOneRoleController = async (req, res, next) => {
  try {
    const data = await getOne(req);
    return success(res, data, "Role berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const getAllRoleController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, "Role berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const destroyRoleController = async (req, res, next) => {
  try {
    const data = await destroy(req);
    return success(res, data, "Role berhasil dihapus!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoleController,
  updateRoleController,
  getOneRoleController,
  getAllRoleController,
  destroyRoleController,
};
