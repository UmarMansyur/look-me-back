const {
  create,
  update,
  getOne,
  getAll,
  destroy,
} = require("../services/operating_hours.service");

const { success } = require("../utils/response.handler");

const createOperatingHoursController = async (req, res, next) => {
  try {
    const data = await create(req);
    return success(res, data, "Jam Operasional berhasil dibuat!", 201);
  } catch (error) {
    next(error);
  }
};

const updateOperatingHoursController = async (req, res, next) => {
  try {
    const data = await update(req);
    return success(res, data, "Jam Operasional berhasil diubah!", 200);
  } catch (error) {
    next(error);
  }
};

const getOneOperatingHoursController = async (req, res, next) => {
  try {
    const data = await getOne(req);
    return success(res, data, "Jam Operasional berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const getAllOperatingHoursController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, "Jam Operasional berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const destroyOperatingHoursController = async (req, res, next) => {
  try {
    const data = await destroy(req);
    return success(res, data, "Jam Operasional berhasil dihapus!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOperatingHoursController,
  updateOperatingHoursController,
  getOneOperatingHoursController,
  getAllOperatingHoursController,
  destroyOperatingHoursController,
};
