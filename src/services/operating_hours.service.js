const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const getAll = async (req) => {
  const { page = 1, limit = 10, search } = req.query;
  const { institution_id } = req.user;

  const where = {
    institution_id: Number(institution_id),
  };

  if(search) {
    where.OR = [
      {
        start_time: {
          contains: search,
        },
      },
      {
        end_time: {
          contains: search,
        },
      },
      {
        status: {
          contains: search,
        },
      },
      {
        late_tolerance: {
          contains: search,
        },
      }
    ];
  }



  const data = await paginate(where, page, limit, 'operatingHours')

  return data;
}

const getOne = async (req) => {
  const { id } = req.params;
  const { institution_id } = req.user;

  const data = await prisma.operatingHours.findFirst({
    where: {
      id: Number(id),
      institution_id: Number(institution_id),
    },
    include: {
      institution: true
    }
  });

  return data;
}

const create = async (req) => {
  const { institution_id } = req.user;
  const { start_time, end_time, status, late_tolerance } = req.body;

  const existingOperatingHours = await prisma.operatingHours.findFirst({
    where: {
      start_time,
      end_time,
      institution_id: Number(institution_id),
    },
  });

  if (existingOperatingHours) {
    return badRequest("Jam operasional sudah ada!");
  }

  const data = await prisma.operatingHours.create({
    data: {
      institution_id: Number(institution_id),
      start_time,
      end_time,
      status: status == 'true' ? true : false,
      late_tolerance,
    },
  });

  return data;
};

const update = async (req) => {
  const { id } = req.params;
  const { institution_id } = req.user;
  const { start_time, end_time, status, late_tolerance } = req.body;

  const existingOperatingHours = await prisma.operatingHours.findFirst({
    where: {
      id: Number(id),
      institution_id: Number(institution_id),
    },
  });

  if (!existingOperatingHours) {
    return badRequest("Jam operasional tidak ditemukan!");
  }

  const existingOperatingHoursTime = await prisma.operatingHours.findFirst({
    where: {
      start_time,
      end_time,
      institution_id: Number(institution_id),
      NOT: {
        id: Number(id),
      },
    },
  });

  if (existingOperatingHoursTime) {
    return badRequest("Jam operasional sudah ada!");
  }

  const data = await prisma.operatingHours.update({
    where: {
      id: Number(id),
    },
    data: {
      start_time,
      end_time,
      status: status == 'true' ? true : false,
      late_tolerance,
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;
  const { institution_id } = req.user;

  const existingOperatingHours = await prisma.operatingHours.findFirst({
    where: {
      id: Number(id),
    },
  });

  if(!existingOperatingHours) {
    return badRequest("Jam operasional tidak ditemukan!");
  }

  if(existingOperatingHours.institution_id !== Number(institution_id)) {
    return badRequest("Pelanggaran hak akses!");
  }

  const data = await prisma.operatingHours.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
};