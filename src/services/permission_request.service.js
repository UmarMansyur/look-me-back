const { Status } = require("@prisma/client");
const prisma = require("../utils/db");
const { badRequest } = require("../utils/api.error");
const { uploadFile, uploadFileBytes } = require("../utils/imageKit");
const { paginate } = require("../utils/pagination");

const create = async (req) => {
  const {
    title,
    desc,
    type,
    start_date,
    end_date,
    status = Status.Pending,
  } = req.body;

  const { id } = req.user;

  const existingPermissionRequest = await prisma.permissionRequest.findFirst({
    where: {
      user_id: Number(id),
      AND: {
        start_date: {
          lte: new Date(new Date(start_date).setHours(23, 59, 59, 999)),
        },
        end_date: {
          gte: new Date(new Date(end_date).setHours(0, 0, 0, 0)),
        },
      },
      status: {
        notIn: [Status.Approved, Status.Revised],
      },
    },
  });

  if (existingPermissionRequest) {
    return badRequest("Permintaan izin sudah ada!");
  }

  const file = req.file;
  let imageUrl = undefined;
  if (file) {
    // kirim
    imageUrl = await uploadFileBytes(file);
  }

  const response = await prisma.permissionRequest.create({
    data: {
      user_id: Number(id),
      title,
      desc,
      type,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      status,
      file: imageUrl,
    },
  });

  return response;
};

const update = async (req) => {
  const { id } = req.params;
  const { title, desc, type, start_date, end_date, status } = req.body;
  const { id: userId } = req.user;

  const existingPermissionRequest = await prisma.permissionRequest.findFirst({
    where: {
      id: Number(id),
      user_id: Number(userId),
    },
  });

  if (!existingPermissionRequest) {
    return badRequest("Data tidak ditemukan!");
  }

  const file = req.file;
  let imageUrl = undefined;
  if (file) {
    if (existingPermissionRequest.file) {
      await deleteFile(existingPermissionRequest.file);
    }
    imageUrl = await uploadFile(file);
  }

  const response = await prisma.permissionRequest.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      desc,
      type,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      status,
      file: imageUrl,
    },
  });

  return response;
};

const updateStatus = async (req) => {
  const { status, reason } = req.body;
  const { id } = req.params;

  if ((status === Status.Revised || status === Status.Rejected) && !reason) {
    return badRequest("Alasan harus diisi!");
  }

  const existingPermissionRequest = await prisma.permissionRequest.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingPermissionRequest) {
    return badRequest("Data tidak ditemukan!");
  }

  if (existingPermissionRequest.status === Status.Approved) {
    return badRequest("Permintaan izin sudah disetujui!");
  }

  if (existingPermissionRequest.status === Status.Rejected) {
    return badRequest("Permintaan izin sudah ditolak!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const response = await tx.permissionRequest.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        reason,
      },
    });

    const userInstitution = await prisma.userInstitution.findFirst({
      where: {
        user_id: existingPermissionRequest.user_id,
      },
    });

    if (status === Status.Approved) {
      const startDate = new Date(existingPermissionRequest.start_date);
      const endDate = new Date(existingPermissionRequest.end_date);
      const attendance = [];
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        attendance.push({
          user_id: existingPermissionRequest.user_id,
          institution_id: userInstitution.institution_id,
          type: existingPermissionRequest.type,
          images: "",
          check_in: new Date(new Date(date).setHours(7, 0, 0, 0)),
          check_out: new Date(new Date(date).setHours(16, 0, 0, 0)),
          lat: "",
          long: "",
        });
      }

      await tx.attendance.createMany({
        data: attendance,
      });
    }

    return response;
  });

  return result;
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
        desc: {
          contains: search,
        },
      },
    ];
  }

  const response = await paginate(where, page, limit, "permissionRequest");

  return response;
};

const getPermissionRequest = async (req) => {
  const { search } = req.query;
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
        desc: {
          contains: search,
        },
      },
    ];
  }

  const response = await prisma.permissionRequest.findMany({
    where,
  });

  // group by month of start_date
  // result json { data: { month: 'Februari 2025', value: []}}
  const grouped = response.reduce((acc, curr) => {
    delete curr.user_id;
    const date = new Date(curr.start_date);
    const month = date.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });
    acc[month] = acc[month] || [];
    acc[month].push(curr);
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([month, value]) => {
    return {
      month: month.toLocaleString("id-ID", { month: "long", year: "numeric" }),
      value: value.map((item) => {
        let header = "";
        if (item.type === "Permission") {
          header = "Izin";
        } else if (item.type === "Leave") {
          header = "Cuti";
        } else if (item.type === "Sickness") {
          header = "Sakit";
        }
        return {
          title: item.title,
          header: "Permohonan Izin (" + header + ")",
          desc: item.desc,
          type: item.type,
        start_date: new Date(item.start_date).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        end_date: new Date(item.end_date).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        date: new Date(item.created_at).getDate(),
        day: new Date(item.created_at).toLocaleString("id-ID", {
          weekday: "long",
          }),
          status: item.status,
          reason: item.reason,
          file: item.file,
        };
      }),
    };
  });

  const total_sakit = response.filter(
    (item) => item.type === "Sickness"
  ).length;
  const total_izin = response.filter(
    (item) => item.type === "Permission"
  ).length;
  const total_cuti = response.filter((item) => item.type === "Leave").length;

  return {
    data,
    total: response.length,
    total_sakit,
    total_izin,
    total_cuti,
  };
};
const getValidation = async (req) => {
  const { institution_id } = req.query;
  const { page = 1, limit = 10, search } = req.query;

  const where = {};

  const userInstitution = await prisma.userInstitution.findMany({
    where: {
      institution_id: Number(institution_id),
    },
  });

  const userIds = userInstitution.map((item) => item.user_id);

  where.user_id = {
    in: userIds,
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        desc: {
          contains: search,
        },
      },
      {
        user: {
          OR: [
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
          ],
        },
      },
    ];
  }

  const include = {
    user: true,
  };

  const response = await paginate(
    where,
    page,
    limit,
    "permissionRequest",
    include
  );

  return response;
};

const getOne = async (req) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const response = await prisma.permissionRequest.findFirst({
    where: {
      id: Number(id),
      user_id: Number(userId),
    },
  });

  return response;
};

const destroy = async (req) => {
  const { id } = req.params;

  const existingPermissionRequest = await prisma.permissionRequest.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingPermissionRequest) {
    return badRequest("Data tidak ditemukan!");
  }

  const response = await prisma.permissionRequest.delete({
    where: {
      id: Number(id),
    },
  });

  return response;
};

module.exports = {
  create,
  updateStatus,
  update,
  getAll,
  getOne,
  destroy,
  getValidation,
  getPermissionRequest,
};
