const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const create = async (req) => {
  const { user_id, title, message } = req.body;
  const { id } = req.user;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(user_id),
    },
  });

  if (!existingUser) {
    return badRequest("User tidak ditemukan!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.warningLetter.create({
      data: {
        sender_id: Number(id),
        user_id: Number(user_id),
        title,
        message,
      },
    });

    const sender = await tx.user.findFirst({
      where: {
        id: Number(id),
      },
    });
    await tx.notification.create({
      data: {
        user_id: Number(user_id),
        title: "Anda Mendapatkan Surat Peringatan",
        message: `Anda mendapatkan surat peringatan dari ${sender.username}. Silahkan cek surat peringatan anda.`,
        routes: `/pesan/${data.id}`,
        is_read: false,
      },
    });
    return data;
  });

  return result;
};

const update = async (req) => {
  const { id } = req.params;
  const { title, message } = req.body;
  const { id: userId } = req.user;

  const existingWarningLetter = await prisma.warningLetter.findFirst({
    where: {
      id: Number(id),
      sender_id: Number(userId),
    },
  });

  if (!existingWarningLetter) {
    return badRequest("Data tidak ditemukan!");
  }

  const data = await prisma.warningLetter.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      message,
    },
  });

  return data;
};

const getAll = async (req) => {
  const { page = 1, limit = 10, search, institution_id } = req.query;
  const { id } = req.user;

  const list_user = await prisma.userInstitution.findMany({
    where: {
      institution_id: Number(institution_id),
    },
    include: {
      user: true,
    },
  });
  
  const list_user_id = list_user.map((item) => item.user_id);

  const where = {
    user_id: {
      in: list_user_id,
    },
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        message: {
          contains: search,
        },
      },
    ];
  }

  const include = {
    user: true,
    sender: true
  };

  const data = await paginate(where, page, limit, "warningLetter", include);

  return data;
};

const getOne = async (req) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const data = await prisma.warningLetter.findFirst({
    where: {
      id: Number(id),
      user_id: Number(userId),
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const existingWarningLetter = await prisma.warningLetter.findFirst({
    where: {
      id: Number(id),
      user_id: Number(userId),
    },
  });

  if (!existingWarningLetter) {
    return badRequest("Data tidak ditemukan!");
  }

  const data = await prisma.warningLetter.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  destroy,
};
