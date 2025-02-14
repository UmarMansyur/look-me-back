const { adminDashboard } = require("../services/dashboard.service");
const { success } = require('../utils/response.handler');

const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await adminDashboard();
    return success(res, data, "Dashboard berhasil diambil!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
};

