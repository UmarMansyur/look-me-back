const { Status } = require("@prisma/client");
const prisma = require("../utils/db");
const { badRequest } = require("../utils/api.error");
const { uploadFile } = require("../utils/imageKit");

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
    },
  });

  if (existingPermissionRequest) {
    return badRequest("Permintaan izin sudah ada!");
  }

  const file = req.file;
  let imageUrl = undefined;
  if (!file) {
    imageUrl = await uploadFile(file);
  }

  const response = await prisma.permissionRequest.create({
    data: {
      user_id: Number(user_id),
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

  if(!existingPermissionRequest) {
    return badRequest("Data tidak ditemukan!");
  }

  const response = await prisma.permissionRequest.update({  
    where: {
      id: Number(id),
    },
    data: {
      status,
      reason,
    },
  });

  return response;
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
};
