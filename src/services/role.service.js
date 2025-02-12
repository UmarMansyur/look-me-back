const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const create = async (req) => {
  const { name } = req.body;

  const existingRole = await prisma.role.findFirst({
    where: {
      name,
    },
  });

  if (existingRole) {
    return badRequest("Role sudah ada!");
  }

  const data = await prisma.role.create({
    data: {
      name,
    },
  });

  return data;
};

const update = async (req) => {
  const { name } = req.body;
  const { id } = req.params;

  const existingRole = await prisma.role.findFirst({
    where: {
      id,
    },
  });

  if (!existingRole) {
    return badRequest("Role tidak ditemukan!");
  }

  const existingRoleName = await prisma.role.findFirst({
    where: {
      name,
      NOT: {
        id: Number(id),
      },
    },
  });

  if (!existingRoleName) {
    return badRequest("Role sudah ada!");
  }

  const data = await prisma.role.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return data;
};

const getAll = async (req) => {
  const { page, limit, search } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
        }
      },
    ];
  }

  return await paginate(where, page, limit, "role");
};

const getOne = async (req) => {
  const { id } = req.params;

  const data = await prisma.role.findFirst({
    where: {
      id,
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;

  const existingRole = await prisma.role.findFirst({
    where: {
      id,
    },
  });

  if (!existingRole) {
    return badRequest("Role tidak ditemukan!");
  }

  const data = await prisma.role.delete({
    where: {
      id,
    },
  });

  return data;
};

module.exports = { create, update, getAll, getOne, destroy };
