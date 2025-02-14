const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const create = async (req) => {
  const { name, address, email, phone, lat, long } = req.body;

  console.log(name, address, email, phone, lat, long);

  const existingInstitution = await prisma.institution.findFirst({
    where: {
      OR: [
        {
          name,
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

  if (existingInstitution?.name === name) {
    return badRequest("Nama institusi sudah ada!");
  }

  if (existingInstitution?.email === email) {
    return badRequest("Email institusi sudah ada!");
  }

  if (existingInstitution?.phone === phone) {
    return badRequest("Nomor telepon institusi sudah ada!");
  }

  const data = await prisma.institution.create({
    data: {
      name,
      address,
      email,
      phone,
      lat,
      long,
    },
  });

  return data;
};

const update = async (req) => {
  const { name, address, email, phone, lat, long } = req.body;
  const { id } = req.params;

  const existingInstitution = await prisma.institution.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingInstitution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const existingInstitutionName = await prisma.institution.findFirst({
    where: {
      OR: [
        {
          name,
        },
        {
          email,
        },
        {
          phone,
        },
      ],
      NOT: {
        id: Number(id),
      },
    },
  });

  if (existingInstitutionName) {
    return badRequest("Institusi sudah ada!");
  }

  const data = await prisma.institution.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      address,
      email,
      phone,
      lat,
      long,
    },
  });

  return data;
};

const getAll = async (req) => {
  const { page, limit } = req.query;
  const where = {};

  if (req.query.search) {
    where.OR = [
      {
        name: {
          contains: req.query.search,
        },
      },
      {
        address: {
          contains: req.query.search,
        },
      },
      {
        email: {
          contains: req.query.search,
        },
      },
      {
        phone: {
          contains: req.query.search,
        },
      },
    ];
  }
  
  return await paginate(where, page, limit, "institution");
};

const getOne = async (req) => {
  const { id } = req.params;

  const data = await prisma.institution.findFirst({
    where: {
      id: Number(id),
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;

  const existingInstitution = await prisma.institution.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!existingInstitution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const data = await prisma.institution.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
};

module.exports = { create, update, getAll, getOne, destroy };
