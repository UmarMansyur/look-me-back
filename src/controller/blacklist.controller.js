const {
    create,
    update,
    getOne,
    getAll,
    destroy,
  } = require("../services/blacklist.service");
  
  const { success } = require('../utils/response.handler');
  
  const createController = async (req, res, next) => {
    try {
      const data = await create(req);
      return success(res, data, "Blokir pengguna berhasil dibuat!", 201);
    } catch (error) {
      next(error);
    }
  };
  
  const updateController = async (req, res, next) => {
    try {
      const data = await update(req);
      return success(res, data, "Blokir pengguna berhasil diubah!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const getOneController = async (req, res, next) => {
    try {
      const data = await getOne(req);
      return success(res, data, "Blokir pengguna berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const getAllController = async (req, res, next) => {
    try {
      const data = await getAll(req);
      return success(res, data, "Blokir pengguna berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const destroyController = async (req, res, next) => {
    try {
      const data = await destroy(req);
      return success(res, data, "Blokir pengguna berhasil dihapus!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    createController,
    updateController,
    getOneController,
    getAllController,
    destroyController,
  };
  