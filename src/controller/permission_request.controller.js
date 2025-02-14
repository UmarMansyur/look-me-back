const {
    create,
    update,
    getOne,
    getAll,
    destroy,
    updateStatus,
    getValidation,
  } = require("../services/permission_request.service");
  
  const { success } = require('../utils/response.handler');
  
  const createPermissionRequestController = async (req, res, next) => {
    try {
      const data = await create(req);
      return success(res, data, "Permintaan izin berhasil dibuat!", 201);
    } catch (error) {
      next(error);
    }
  };
  
  const updatePermissionRequestController = async (req, res, next) => {
    try {
      const data = await update(req);
      return success(res, data, "Permintaan izin berhasil diubah!", 200);
    } catch (error) {
      next(error);
    }
  };

  const updateStatusPermissionRequestController = async (req, res, next) => {
    try {
      const data = await updateStatus(req);
      return success(res, data, "Permintaan izin berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  }
  
  const getOnePermissionRequestController = async (req, res, next) => {
    try {
      const data = await getOne(req);
      return success(res, data, "Permintaan izin berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const getAllPermissionRequestController = async (req, res, next) => {
    try {
      const data = await getAll(req);
      return success(res, data, "Permintaan izin berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const destroyPermissionRequestController = async (req, res, next) => {
    try {
      const data = await destroy(req);
      return success(res, data, "Permintaan izin berhasil dihapus!", 200);
    } catch (error) {
      next(error);
    }
  };

  const getValidationPermissionRequestController = async (req, res, next) => {
    try {
      const data = await getValidation(req);
      return success(res, data, "Permintaan izin berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  }
  
  module.exports = {
    createPermissionRequestController,
    updatePermissionRequestController,
    getOnePermissionRequestController,
    getAllPermissionRequestController,
    destroyPermissionRequestController,
    updateStatusPermissionRequestController,
    getValidationPermissionRequestController,
  };
  