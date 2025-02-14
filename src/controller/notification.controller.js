const { getAll, readAll, readOne } = require('../services/notification.service');
const { success } = require('../utils/response.handler');

const getAllController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, 'Notification berhasil diambil!', 200);
  } catch (error) {
    next(error);
  }
};

const readAllController = async (req, res, next) => {
  try {
    const data = await readAll(req);
    return success(res, data, 'Notification berhasil dibaca semua!', 200);
  } catch (error) {
    next(error);
  }
};

const readOneController = async (req, res, next) => {
  try {
    const data = await readOne(req);
    return success(res, data, 'Notification berhasil dibaca!', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllController,
  readAllController,
  readOneController,
};
