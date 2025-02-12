const prisma = require("../utils/db");
const { badRequest } = require("../utils/api.error");
const { paginate } = require("../utils/pagination");

const getAll = async (req) => {
  const { page = 1, limit = 10, search } = req.query;
  const { institution_id } = req.user;

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

  const data = await paginate(where, page, limit, "holiday");

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
  const { institution_id } = req.user;
  const { start_date, end_date, event } = req.body;

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
      start_date,
      end_date,
      event: event,
    },
  });

  return data;
};

const syncrhonize = async (req) => {
  const { institution_id } = req.user;

  const response = await fetch("https://api-harilibur.vercel.app/api");
  const result = await response.json();

  const existingHolyday = await prisma.holiday.findMany({
    where: {
      institution_id: Number(institution_id),
    },
  });

  const holidays = existingHolyday.filter((item) => {
    return !result.some(
      (item2) =>
        item2.holiday_date === item.start_date &&
        item2.holiday_name === item.event
    );
  });

  if (holidays.length === 0) {
    return [];
  }

  const data = await prisma.holiday.createMany({
    data: holidays.map((item) => ({
      institution_id: Number(institution_id),
      start_date: new Date(item.holiday_date),
      end_date: new Date(item.holiday_date),
      event: item.holiday_name,
    })),
  });

  return data;
};

const update = async (req) => {
  const { institution_id } = req.user;
  const { id, start_date, end_date, description } = req.body;

  const existingHolyday = await prisma.holiday.findFirst({
    where: {
      start_date,
      end_date,
      institution_id: Number(institution_id),
    },
  });

  if (existingHolyday && existingHolyday.id !== id) {
    return badRequest("Tanggal libur sudah ada!");
  }

  const data = await prisma.holiday.update({
    where: {
      id: Number(id),
    },
    data: {
      start_date,
      end_date,
      event: description,
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
