const { unauthorized, badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const bcrypt = require("bcrypt");
const { deleteFile, uploadFile } = require("../utils/imageKit");
const { generateToken, decodeToken } = require("../utils/jwt");
const { sendMail } = require("../utils/nodemailer");
const jwt = require("jsonwebtoken");
const { paginate } = require("../utils/pagination");

const login = async (req) => {
  const { username, password } = req.body;

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
    return unauthorized(
      "Anda tidak dapat masuk ke sistem, karena akun anda telah diblokir oleh administrator!"
    );
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return unauthorized("Password salah!");
  }

  const payload = {
    id: existingUser.id,
    username: existingUser.username,
    role: existingUser.userRoles.map(item => item.role.name),
    institution: existingUser.userInstitutions[0].institution.name,
  };

  return {
    access_token: generateToken(payload, "access"),
    refresh_token: generateToken(payload, "refresh"),
  };
};

const loginPegawai = async (req) => {
  const { email, password } = req.body;

  console.log(email, password);

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
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

  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return unauthorized("Password salah!");
  }

  const payload = {
    id: existingUser.id,
    username: existingUser.username,
    role: existingUser.userRoles.map(item => item.role.name),
    institution: existingUser.userInstitutions[0]?.institution,
  };

  return {
    access_token: jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: "1d" }),
    refresh_token: jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: "7d" }),
  };
  
}

const register = async (req) => {
  const {
    username,
    password,
    email,
    phone,
    date_of_birth,
    address,
    gender,
    role_id,
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
      id: Number(role_id),
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
      address: address === null ? undefined : address,
      thumbnail: imageUrl === null ? undefined : imageUrl,
      gender,
      userRoles: {
        create: {
          role_id: Number(role_id),
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
      id: payload.id,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  delete payload.iat;
  delete payload.exp;

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
  const {
    id,
    username,
    email,
    phone,
    date_of_birth,
    address,
    gender,
    role_id,
    institution_id,
  } = req.body;

  const existingUser = await prisma.user.findFirst({
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

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const file = req.file;
  let imageUrl = undefined;
  if (file) {
    if (existingUser.thumbnail !== null || existingUser.thumbnail !== "") {
      await deleteFile(existingUser.thumbnail);
    }
    imageUrl = await uploadFile(file);
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
      gender,
      address: address === null ? undefined : address,
      thumbnail: imageUrl,
    },
  });

  if (role_id) {
    await prisma.userRole.updateMany({
      where: {
        user_id: Number(id),
        role_id: existingUser.userRoles[0].role_id,
      },
      data: {
        role_id: Number(role_id),
      },
    });
  }

  if (institution_id) {
    await prisma.userInstitution.updateMany({
      where: {
        user_id: Number(id),
        institution_id: existingUser.userInstitutions[0].institution_id,
      },
      data: {
        institution_id: Number(institution_id),
      },
    });
  }

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
  const { id, password, username } = req.body;

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
      id: {
        not: Number(id),
      },
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

const forgotPassword = async (req) => {
  const { email } = req.body;
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const token = generateToken({ id: existingUser.id }, "access", "1h");

  await sendMail(
    email,
    "Reset Password",
    `Silahkan klik link berikut untuk mereset password anda: <br>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
    <br>
    Jika anda tidak merasa melakukan permintaan ini, abaikan email ini!
    `
  );

  return [];
};

const resetPassword = async (req) => {
  const { token, password } = req.body;
  const payload = decodeToken(token, "access");

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await sendMail(email, "Reset Password", `Password anda berhasil direset!`);

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

  if (roleUser.role.name !== "Administrator") {
    return unauthorized("Anda tidak memiliki akses untuk menghapus akun!");
  }

  const data = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
};

const getAllUser = async (req) => {
  const { id } = req.user;


  const { page = 1, limit = 10, search = "" } = req.query;
  const where = {};

  if (search) {
    where.OR = [
      {
        username: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
        },
      },
      {
        phone: {
          contains: search,
        },
      },
    ];
  }

  const roleUser = await prisma.userRole.findMany({
    where: {
      user_id: id,
    },
    include: {
      user: {
        include: {
          userInstitutions: {
            include: {
              institution: true,
            },
          },
        },
      },
      role: true,
    },
  });

  let list_user = [];
  
  if(!(roleUser.map(item => item.role.name).includes("Administrator"))) {
    const list_institution = roleUser.map(item => item.user.userInstitutions[0].institution_id);
    list_user = await prisma.userInstitution.findMany({
      where: {
        institution_id: {
          in: list_institution,
        },
        user: {
          userRoles: {
            some: {
              role: {
                name: {
                  notIn: ["Administrator"],
                }
              },
            },
          },
        },
      },
    });

    where.id = {
      in: list_user.map(item => item.user_id),
    }
  }

  const include = {
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
  };

  const data = await paginate(where, page, limit, "user", include);

  return data;
};

const getOne = async (req) => {
  const { id } = req.params;

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

  if (!data) {
    return unauthorized("User tidak ditemukan!");
  }

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

  if (!data) {
    return unauthorized("User tidak ditemukan!");
  }

  return data;
};

const changeRole = async (req) => {
  const { id } = req.params;
  const { role_id } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id), 
    },
  });

  if (!existingUser) {
    return unauthorized("User tidak ditemukan!");
  }

  const existingRole = await prisma.role.findFirst({
    where: {
      id: Number(role_id),
    },  
  }); 

  if (!existingRole) {
    return unauthorized("Role tidak ditemukan!");
  }

  // jika ada update, jika tidak ada maka create
  const existingUserRole = await prisma.userRole.findFirst({
    where: {
      user_id: Number(id),
      role_id: Number(role_id),
    },
  });

  let result;

  if (existingUserRole) {
    result = await prisma.userRole.delete({
      where: {
        id: existingUserRole.id,
      },
    });
  } else {
    result = await prisma.userRole.create({
      data: {
        user_id: Number(id),
        role_id: Number(role_id),
      },
    });
  }

  return result;
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
  getAllUser,
  getOne,
  refreshToken,
  forgotPassword,
  resetPassword,
  changeRole,
  loginPegawai
};
