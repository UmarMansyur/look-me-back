const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const calculateDistance = (point1, point2) => {
  const distance = Math.sqrt(
    Math.pow(point1.lat - point2.lat, 2) +
      Math.pow(point1.long - point2.long, 2)
  );
  return distance;
};


const create = async (req) => {
  const { id } = req.user;
  const { lat, long } = req.body;
  const file = req.file;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      userInstitutions: {
        include: {
          institution: true,
        },
      },
    },
  });

  if (!existingUser) {
    return badRequest("User tidak ditemukan!");
  }

  const distance = getDistance(
    existingUser.userInstitutions[0].institution.lat,
    existingUser.userInstitutions[0].institution.long,
    lat,
    long
  );

  if (distance > 0.05) {
    return badRequest("Anda tidak berada di area kantor!");
  }

  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      user_id: Number(id),
      created_at: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  if (existingAttendance) {
    return badRequest("Anda sudah melakukan absensi hari ini!");
  }

  const data = await prisma.attendance.create({
    data: {
      user_id: Number(id),
      lat,
      long,
      image: file.filename,
    },
  });

  return data;
};
