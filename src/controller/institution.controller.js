const {
  create,
  update,
  getOne,
  getAll,
  destroy,
} = require("../services/institution.service");

const { success } = require('../utils/response.handler');

const createInstitutionController = async (req, res, next) => {
  try {
    const data = await create(req);
    return success(res, data, "Institusi berhasil dibuat!", 201);
  } catch (error) {
    next(error);
  }
};

const updateInstitutionController = async (req, res, next) => {
  try {
    const data = await update(req);
    return success(res, data, "Institusi berhasil diubah!", 200);
  } catch (error) {
    next(error);
  }
};

const getOneInstitutionController = async (req, res, next) => {
  try {
    const data = await getOne(req);
    return success(res, data, "Institusi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const getAllInstitutionController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, "Institusi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const destroyInstitutionController = async (req, res, next) => {
  try {
    const data = await destroy(req);
    return success(res, data, "Institusi berhasil dihapus!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInstitutionController,
  updateInstitutionController,
  getOneInstitutionController,
  getAllInstitutionController,
  destroyInstitutionController,
};
