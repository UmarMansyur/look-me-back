const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const create = async (req) => {
  const { user_id, reason, start_date, end_date } = req.body;
  const existingBlackList = await prisma.blackList.findFirst({
    where: {
      user_id: Number(user_id),
      AND: [
        {
          start_date: {
            lte: new Date(new Date(start_date).setHours(23, 59, 59, 999)),
          },
        },
        {
          end_date: {
            gte: new Date(new Date(end_date).setHours(0, 0, 0, 0)),
          },
        },
      ],
    },
  });

  if (existingBlackList) {
    return badRequest("Pengguna sudah terdaftar dalam daftar hitam!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.blackList.create({
      data: {
        user_id: Number(user_id),
        reason,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    await tx.notification.create({
      data: {
        user_id: Number(user_id),
        title: "Anda Telah Diblokir",
        message: `Anda telah diblokir oleh administrator karena ${reason}. Anda tidak dapat dari tanggal ${new Date(
          data.start_date
        ).toLocaleDateString("id-ID")} hingga ${new Date(
          data.end_date
        ).toLocaleDateString("id-ID")}`,
        routes: "/dashboard",
        is_read: false,
      },
    });

    return data;
  });
  return result;
};

const getAll = async (req) => {
  const { page = 1, limit = 10, search, institution_id } = req.query;
  const where = {};

  const list_user = await prisma.userInstitution.findMany({
    where: {
      institution_id: Number(institution_id),
    },
    include: {
      user: true,
    },
  });

  const list_user_id = list_user.map((item) => item.user_id);

  if (search) {
    where.OR = [
      {
        reason: {
          contains: search,
        },
      },
    ];
  }

  if (institution_id) {
    where.user_id = {
      in: list_user_id,
    };
  }

  const include = {
    user: {
      select: {
        thumbnail: true,
        username: true,
        email: true,
        phone: true,
      },
    },
  };

  const data = await paginate(where, page, limit, "blackList", include);

  return data;
};

const getOne = async (req) => {
  const { id } = req.params;

  const data = await prisma.blackList.findFirst({
    where: {
      id: Number(id),
    },
  });

  return data;
};

const update = async (req) => {
  const { id } = req.params;
  const { reason, start_date, end_date } = req.body;

  const existingBlackList = await prisma.blackList.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingBlackList) {
    return badRequest("Data tidak ditemukan!");
  }

  const existingBlackList2 = await prisma.blackList.findFirst({
    where: {
      user_id: existingBlackList.user_id,
      AND: [
        {
          start_date: {
            lte: new Date(new Date(start_date).setHours(23, 59, 59, 999)),
          },
        },
        {
          end_date: {
            gte: new Date(new Date(end_date).setHours(0, 0, 0, 0)),
          },
        },
        {
          id: {
            not: Number(id),
          },
        },
      ],
    },
  });

  if (existingBlackList2) {
    return badRequest("Pengguna sudah terdaftar dalam daftar hitam!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.blackList.update({
      where: {
        id: Number(id),
      },
      data: {
        reason,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    await tx.notification.create({
      data: {
        user_id: existingBlackList.user_id,
        title: "Anda Telah Diblokir",
        message: `Terdapat perubahan pada waktu atau alasan pemblokiran akun anda. Anda telah diblokir oleh administrator karena ${reason}. Anda tidak dapat dari tanggal ${new Date(
          data.start_date
        ).toLocaleDateString("id-ID")} hingga ${new Date(
          data.end_date
        ).toLocaleDateString("id-ID")}`,
        routes: "/dashboard",
        is_read: false,
      },
    });

    return data;
  });
};

const destroy = async (req) => {
  const { id } = req.params;

  const existingBlackList = await prisma.blackList.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingBlackList) {
    return badRequest("Data tidak ditemukan!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.blackList.delete({
      where: {
        id: Number(id),
      },
    });

    await tx.notification.create({
      data: {
        user_id: existingBlackList.user_id,
        title: "Penghapusan Pemblokiran",
        message: `Akun anda telah dibuka oleh administrator`,
        routes: "/dashboard",
        is_read: false,
      },
    });

    return data;
  });

  return result;
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  destroy,
};
