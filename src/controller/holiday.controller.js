const {
  create,
  update,
  getOne,
  getAll,
  destroy,
  syncrhonize
} = require("../services/holiday.service");

const { success } = require("../utils/response.handler");

const createHolidayController = async (req, res, next) => {
  try {
    const data = await create(req);
    return success(res, data, "Hari Libur berhasil dibuat!", 201);
  } catch (error) {
    next(error);
  }
};

const updateHolidayController = async (req, res, next) => {
  try {
    const data = await update(req);
    return success(res, data, "Hari Libur berhasil diubah!", 200);
  } catch (error) {
    next(error);
  }
};

const synchronizeHolidayController = async (req, res, next) => {
  try {
    const data = await syncrhonize(req);
    return success(res, data, "Hari Libur berhasil disinkronisasi!", 200);
  } catch (error) {
    next(error);
  }
}

const getOneHolidayController = async (req, res, next) => {
  try {
    const data = await getOne(req);
    return success(res, data, "Hari Libur berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const getAllHolidayController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, "Hari Libur berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const destroyHolidayController = async (req, res, next) => {
  try {
    const data = await destroy(req);
    return success(res, data, "Hari Libur berhasil dihapus!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHolidayController,
  updateHolidayController,
  getOneHolidayController,
  getAllHolidayController,
  destroyHolidayController,
  synchronizeHolidayController,
};
