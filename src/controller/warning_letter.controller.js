const {
    create,
    update,
    getOne,
    getAll,
    destroy,
  } = require("../services/warning_letter.service");
  
  const { success } = require('../utils/response.handler');
  
  const createWarningLetterController = async (req, res, next) => {
    try {
      const data = await create(req);
      return success(res, data, "Surat peringatan berhasil dibuat!", 201);
    } catch (error) {
      next(error);
    }
  };
  
  const updateWarningLetterController = async (req, res, next) => {
    try {
      const data = await update(req);
      return success(res, data, "Surat peringatan berhasil diubah!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const getOneWarningLetterController = async (req, res, next) => {
    try {
      const data = await getOne(req);
      return success(res, data, "Surat peringatan berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const getAllWarningLetterController = async (req, res, next) => {
    try {
      const data = await getAll(req);
      return success(res, data, "Surat peringatan berhasil ditemukan!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  const destroyWarningLetterController = async (req, res, next) => {
    try {
      const data = await destroy(req);
      return success(res, data, "Surat peringatan berhasil dihapus!", 200);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    createWarningLetterController,
    updateWarningLetterController,
    getOneWarningLetterController,
    getAllWarningLetterController,
    destroyWarningLetterController,
  };
  