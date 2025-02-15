const prisma = require("../utils/db");
const { badRequest } = require("../utils/api.error");
const { paginate } = require("../utils/pagination");

const getAll = async (req) => {
  const { page = 1, limit = 10, search, institution_id } = req.query;

  const where = {
    institution_id: Number(institution_id),
  };

  if (search) {
    where.OR = [
      {
        start_date: {
          contains: new Date(search),
        },
      },
      {
        end_date: {
          contains: new Date(search),
        },
      },
      {
        event: {
          contains: search,
        },
      },
    ];
  }

  const orderBy = {
    start_date: "desc",
  };

  const data = await paginate(where, page, limit, "holiday", undefined, orderBy);

  return data;
}

const getOne = async (req) => {
  const { id } = req.params;

  const data = await prisma.holiday.findFirst({
    where: {
      id: Number(id),
    },
  });

  return data;
};

const create = async (req) => {
  const { start_date, end_date, event, institution_id } = req.body;

  const existingHolyday = await prisma.holiday.findFirst({
    where: {
      start_date,
      end_date,
      institution_id: Number(institution_id),
    },
  });

  if (existingHolyday) {
    return badRequest("Tanggal libur sudah ada!");
  }

  const data = await prisma.holiday.create({
    data: {
      institution_id: Number(institution_id),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      event: event,
    },
  });

  return data;
};

const syncrhonize = async (req) => {
  const { id } = req.user;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;
  
  
  const response = await fetch("https://api-harilibur.vercel.app/api");
  const result = await response.json();



  const existingHolyday = await prisma.holiday.findMany({
    where: {
      institution_id: Number(institution_id),
    },
  });

  const temp = [];
  result.forEach(async (item) => {
    const existing = existingHolyday.find((item2) => item2.event === item.holiday_name);
    if (!existing) {
      temp.push({
        institution_id: Number(institution_id),
        start_date: new Date(item.holiday_date),
        end_date: new Date(item.holiday_date),
        event: item.holiday_name,
      });
    }
  });

  if (temp.length === 0) {
    return [];
  }

  const data = await prisma.holiday.createMany({
    data: temp,
  });

  return data;
};

const update = async (req) => {
  const { id } = req.params;
  const { start_date, end_date, event, institution_id } = req.body;

  const existingHolyday = await prisma.holiday.findFirst({
    where: {
      event: event,
      start_date,
      end_date,
      institution_id: Number(institution_id),
      NOT: {
        id: Number(id),
      },
    },
  });

  if (existingHolyday) {
    return badRequest(
      "Tanggal libur sudah ada!, Silahkan cek kembali tanggal awal dan tanggal akhir"
    );
  }

  const data = await prisma.holiday.update({
    where: {
      id: Number(id),
    },
    data: {
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      event: event,
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;

  const data = await prisma.holiday.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
};

module.exports = {
  getAll,
  getOne,
  create,
  syncrhonize,
  update,
  destroy,
};
