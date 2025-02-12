const { unauthorized, badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { loginSchema, updateSchema } = require("../utils/definition.types");
const bcrypt = require("bcrypt");
const { deleteFile, uploadFile } = require("../utils/imageKit");
const { generateToken, decodeToken } = require("../utils/jwt");

const login = async (req) => {
  const { username, password } = req.body;

  loginSchema.parse({ username, password });

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      userInstitutions: {
        include: {
          institution: true,
        },
      },
    },
  });

  if (!existingUser) {
    return unauthorized("Akun tidak ditemukan!");
  }
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const existingBlackList = await prisma.blackList.findFirst({
    where: {
      user_id: existingUser.id,
      start_date: {
        lte: endOfDay,
      },
      end_date: {
        gte: startOfDay,
      },
    },
  });

  if (existingBlackList) {
    return unauthorized("Anda tidak dapat masuk ke sistem, karena akun anda telah diblokir oleh administrator!");
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return unauthorized("Password salah!");
  }

  const payload = {
    id: existingUser.id,
    username: existingUser.username,
    role: existingUser.userRoles[0].role.name,
    institution: existingUser.userInstitutions[0].institution.name,
  };

  return {
    access_token: generateToken(payload, "access"),
    refresh_token: generateToken(payload, "refresh"),
  };
};

const register = async (req) => {
  const {
    username,
    password,
    email,
    phone,
    date_of_birth,
    addres,
    role,
    institution_id,
  } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
        },
        {
          email,
        },
        {
          phone,
        },
      ],
    },
  });

  if (existingUser) {
    return badRequest("Username sudah digunakan!");
  }

  const existingRole = await prisma.role.findFirst({
    where: {
      role,
    },
  });

  if (!existingRole) {
    return badRequest("Role tidak ditemukan!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let imageUrl = null;
  if (req.file) {
    imageUrl = await uploadFile(req.file);
  }

  const data = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
      phone,
      date_of_birth: new Date(date_of_birth),
      addres,
      thumbnail: imageUrl === null ? undefined : imageUrl,
      userRoles: {
        create: {
          role_id: existingRole.id,
        },
      },
      userInstitutions: {
        create: {
          institution_id: Number(institution_id),
        },
      },
    },
  });

  return data;
};

const refreshToken = async (req) => {
  const { token_refresh } = req.body;

  const payload = decodeToken(token_refresh, "refresh");

  const existingUser = await prisma.user.findFirst({
    where: {
      token_refresh,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  return {
    access_token: generateToken(payload, "access"),
    refresh_token: generateToken(payload, "refresh"),
    role: existingUser.userRoles[0].role.name,
  };
};

const toggleEdit = async (req) => {
  const { id } = req.user;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const data = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      is_edit: !existingUser.is_edit,
    },
  });

  return data;
};

const updateProfile = async (req) => {
  const { id } = req.user;
  const { username, email, phone, date_of_birth, addres } = req.body;

  updateSchema.parse({ username, email, phone, date_of_birth, addres });

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const data = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      username,
      email,
      phone,
      date_of_birth: new Date(date_of_birth),
      addres,
    },
  });

  return data;
};

const updateThumbnail = async (req) => {
  const file = req.file;
  const { id } = req.user;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  if (existingUser.thumbnail !== null || existingUser.thumbnail !== "") {
    await deleteFile(existingUser.thumbnail);
  }

  const imageUrl = await uploadFile(file);

  const data = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      thumbnail: imageUrl,
    },
  });

  return data;
};

const updateAccount = async (req) => {
  const { id } = req.user;
  const { password, username } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUsername = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUsername) {
    return badRequest(
      "Username sudah digunakan oleh pengguna lain, harap untuk mengganti username yang lain!"
    );
  }

  const payload = {};

  if (password) {
    payload.password = hashedPassword;
  }

  if (username) {
    payload.username = username;
  }

  const data = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      ...payload,
    },
  });

  return data;
};

const updateDescription = async (req) => {
  const { id } = req.user;
  const { description } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  if (existingUser.is_edit === false) {
    return unauthorized("User tidak memiliki akses untuk mengubah Data Wajah!");
  }

  const data = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      description,
    },
  });

  return data;
};

const deleteUser = async (req) => {
  const { id } = req.params;
  const me = req.user;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  if (me.id === existingUser.id) {
    return unauthorized("Tidak bisa menghapus akun sendiri!");
  }

  const roleUser = await prisma.userRole.findFirst({
    where: {
      user_id: me.id,
    },
    include: {
      role: true,
    },
  });

  if (roleUser.role !== "Administrator") {
    return unauthorized("Anda tidak memiliki akses untuk menghapus akun!");
  }

  const data = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
};

const getMe = async (req) => {
  const { id } = req.user;

  const data = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      userInstitutions: {
        include: {
          institution: true,
        },
      },
    },
  });

  return data;
};

module.exports = {
  login,
  register,
  toggleEdit,
  updateProfile,
  updateAccount,
  updateDescription,
  deleteUser,
  updateThumbnail,
  getMe,
  refreshToken,
};
