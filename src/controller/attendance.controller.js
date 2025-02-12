const { getAll, getOne, create } = require("../services/attendance.service");

const { success } = require("../utils/response.handler");

const getAllAttendanceController = async (req, res, next) => {
  try {
    const data = await getAll(req);
    return success(res, data, "Absensi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const getOneAttendanceController = async (req, res, next) => {
  try {
    const data = await getOne(req);
    return success(res, data, "Absensi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const createAttendanceController = async (req, res, next) => {
  try {
    const data = await create(req);
    return success(res, data, "Absensi berhasil dibuat!", 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAttendanceController,
  getOneAttendanceController,
  createAttendanceController,
};
