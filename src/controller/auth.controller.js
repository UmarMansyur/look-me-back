const {
  login,
  register,
  deleteUser,
  toggleEdit,
  updateAccount,
  updateDescription,
  updateProfile,
  updateThumbnail,
  getMe,
} = require("../services/auth.service");

const { success } = require("../utils/response.handler");

const loginController = async (req, res, next) => {
  try {
    const data = await login(req);
    return success(res, data, "Login berhasil!", 200);
  } catch (error) {
    next(error);
  }
};

const registerController = async (req, res, next) => {
  try {
    const data = await register(req);
    return success(res, data, "Register berhasil!", 201);
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const data = await deleteUser(req);
    return success(res, data, "Berhasil menghapus pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const toggleEditController = async (req, res, next) => {
  try {
    const data = await toggleEdit(req);
    return success(res, data, "Berhasil mengubah status edit pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const updateAccountController = async (req, res, next) => {
  try {
    const data = await updateAccount(req);
    return success(res, data, "Berhasil mengubah akun pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const updateDescriptionController = async (req, res, next) => {
  try {
    const data = await updateDescription(req);
    return success(res, data, "Berhasil mengubah data wajah pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const updateProfileController = async (req, res, next) => {
  try {
    const data = await updateProfile(req);
    return success(res, data, "Berhasil mengubah profil pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const updateThumbnailController = async (req, res, next) => {
  try {
    const data = await updateThumbnail(req);
    return success(res, data, "Berhasil mengubah thumbnail pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const getMeController = async (req, res, next) => {
  try {
    const data = await getMe(req);
    return success(res, data, "Berhasil mendapatkan data pengguna!", 200);
  } catch (error) {
    next(error);
  }
};

const refreshTokenController = async (req, res, next) => {
  try {
    const data = await refreshToken(req);
    return success(res, data, "Berhasil refresh token!", 200);
  } catch (error) {
    next(error);
  }
};

const forgotPasswordController = async (req, res, next) => {
  try {
    const data = await forgotPassword(req);
    return success(res, data, "Berhasil mengirim email reset password!", 200);
  } catch (error) {
    next(error);
  }
}

const resetPasswordController = async (req, res, next) => {
  try {
    const data = await resetPassword(req);
    return success(res, data, "Berhasil mereset password!", 200);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  loginController,
  registerController,
  deleteUserController,
  toggleEditController,
  updateAccountController,
  updateDescriptionController,
  updateProfileController,
  updateThumbnailController,
  getMeController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
};
