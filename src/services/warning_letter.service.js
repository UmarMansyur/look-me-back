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
    const data = await prisma.warningLetter.create({
      data: {
        user_id: Number(user_id),
        title,
        message,
        created_by: Number(id),
      },
    });
    await tx.notification.create({
      data: {
        user_id: Number(user_id),
        title: "Anda Mendapat Surat Peringatan",
        message: `Anda mendapat surat peringatan. Silahkan cek surat peringatan anda.`,
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
  const { page = 1, limit = 10, search } = req.query;
  const { id } = req.user;

  const where = {
    user_id: Number(id),
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

  const data = await paginate(where, page, limit, "warningLetter");

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
