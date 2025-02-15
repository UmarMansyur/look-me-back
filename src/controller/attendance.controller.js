const { getAll, getOne, create, reportAttendance, exportAttendance, exportPDF } = require("../services/attendance.service");
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

const reportAttendanceController = async (req, res, next) => {
  try {
    const data = await reportAttendance(req);
    return success(res, data, "Absensi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

const exportAttendanceController = async (req, res, next) => {
  try {
    const data = await exportAttendance(req);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const exportPDFController = async (req, res, next) => {
  try {
    const data = await exportPDF(req);
    return success(res, data, "Absensi berhasil ditemukan!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAttendanceController,
  getOneAttendanceController,
  createAttendanceController,
  reportAttendanceController,
  exportAttendanceController,
  exportPDFController,
};
