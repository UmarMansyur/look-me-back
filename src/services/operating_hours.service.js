const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");
const moment = require("moment");

const getAll = async (req) => {
  const { page = 1, limit = 10, search } = req.query;
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
  const { id: user_id } = req.user;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(user_id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;

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
  const { id } = req.user;
  const { start_time, end_time, status, late_tolerance } = req.body;

  const today = moment().format("YYYY-MM-DD");

  if(today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z" > today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z") {
    return badRequest("Jam Mulai tidak boleh lebih dari jam selesai!");
  }

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;

  const existingOperatingHours = await prisma.operatingHours.findFirst({
    where: {

      start_time: today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      end_time: today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      institution_id: Number(institution_id),
    },
  });

  if (existingOperatingHours) {
    return badRequest("Jam operasional sudah ada!");
  }

  const data = await prisma.operatingHours.create({
    data: {
      institution_id: Number(institution_id),
      start_time: today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      end_time: today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      status: status == 'true' ? true : false,
      late_tolerance,
    },
  });

  return data;
};

const update = async (req) => {
  const { id } = req.params;
  const { id: user_id } = req.user;
  const { start_time, end_time, status, late_tolerance } = req.body;

  const today = moment().format("YYYY-MM-DD");
  if(today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z" > today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z") {
    return badRequest("Jam Mulai tidak boleh lebih dari jam selesai!");
  }

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(user_id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;

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
      start_time: today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      end_time: today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
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
      start_time: today + "T" + moment(start_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      end_time: today + "T" + moment(end_time, "HH:mm:ss").format("HH:mm:ss") + "Z",
      status: status == 'true' ? true : false,
      late_tolerance,
    },
  });

  return data;
};

const destroy = async (req) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(user_id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;

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

  if(existingOperatingHours.status === true) {
    return badRequest("Jam operasional masih aktif, nonaktifkan terlebih dahulu untuk menghapus!");
  }

  const data = await prisma.operatingHours.delete({
    where: {
      id: Number(id),
    },
  });

  return data;
}

const changeStatus = async (req) => {
  const { id } = req.params;
  const { status } = req.body;
  const { id: user_id } = req.user;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(user_id),
    },
  });

  if (!institution) {
    return badRequest("Institusi tidak ditemukan!");
  }

  const institution_id = institution.institution_id;

  const data = await prisma.operatingHours.update({
    where: {
      id: Number(id),
    },
    data: {
      status,
    },
  });

  await prisma.operatingHours.updateMany({
    where: {
      institution_id: Number(institution_id),
      NOT: {
        id: Number(id),
      },
    },
    data: {
      status: false,
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
  changeStatus,
};