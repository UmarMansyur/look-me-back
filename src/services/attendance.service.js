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
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

const calculateFaceSimilarity = (face1, face2, fileIndex) => {
  const landmarkDifferences = face1.landmarks.map((landmark1, index) => {
    const landmark2 = face2.landmarks[index];
    return calculateDistance(landmark1, landmark2);
  });

  const avgLandmarkDifference =
    landmarkDifferences.reduce((a, b) => a + b, 0) / landmarkDifferences.length;

  const angleDifferences = {
    x: Math.abs(face1.headEulerAngleX - face2.headEulerAngleX),
    y: Math.abs(face1.headEulerAngleY - face2.headEulerAngleY),
    z: Math.abs(face1.headEulerAngleZ - face2.headEulerAngleZ),
  };

  const avgAngleDifference =
    (angleDifferences.x + angleDifferences.y + angleDifferences.z) / 3;

  const boundingBoxDiff = Math.abs(
    face1.boundingBox.width * face1.boundingBox.height -
      face2.boundingBox.width * face2.boundingBox.height
  );

  let weights = {
    landmark: 0.6,
    angle: 0.3,
    box: 0.1,
  };

  switch (fileIndex) {
    case 0:
      weights = { landmark: 0.7, angle: 0.2, box: 0.1 };
      break;
    case 1:
      weights = { landmark: 0.5, angle: 0.4, box: 0.1 };
      break;
    case 2:
      weights = { landmark: 0.6, angle: 0.3, box: 0.1 };
      break;
    case 3:
      weights = { landmark: 0.4, angle: 0.5, box: 0.1 };
      break;
  }

  // Menghitung skor kesamaan dengan bobot yang berbeda
  const landmarkScore = Math.max(0, 100 - avgLandmarkDifference * 2);
  const angleScore = Math.max(0, 100 - avgAngleDifference * 5);
  const boxScore = Math.max(0, 100 - boundingBoxDiff / 100);

  // Menghitung skor total dengan pembobotan yang berbeda
  const totalScore =
    landmarkScore * weights.landmark +
    angleScore * weights.angle +
    boxScore * weights.box;

  // Menambahkan faktor koreksi berdasarkan fileIndex
  let correctionFactor = 1.0;
  switch (fileIndex) {
    case 0:
      correctionFactor = 1.0; // Normal - tidak ada koreksi
      break;
    case 1:
      correctionFactor = 1.2; // Meningkatkan skor untuk mata tertutup
      break;
    case 2:
      correctionFactor = 0.9; // Menurunkan sedikit untuk posisi berbeda
      break;
    case 3:
      correctionFactor = 0.85; // Menurunkan lebih banyak untuk ekspresi berbeda
      break;
  }

  const finalScore = Math.min(100, totalScore * correctionFactor);

  return {
    similarity: finalScore,
    details: {
      landmarkScore,
      angleScore,
      boxScore,
      weights,
      correctionFactor,
      avgLandmarkDifference,
      angleDifferences,
      boundingBoxDiff,
    },
  };
};

const create = async (req) => {
  const { id } = req.user;
  const { lat, long, data } = req.body;
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

  if (!data || !data.measurements || data.measurements.length === 0) {
    return badRequest("Data tidak boleh kosong!");
  }

  const fileData = JSON.parse(existingUser.description);

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

  const results = [];

  for (let i = 0; i < data.measurements.length; i++) {
    const requestFace = data.measurements[i];

    for (let j = 0; j < fileData.data.measurements.length; j++) {
      const fileFace = fileData.data.measurements[j];
      const comparison = calculateFaceSimilarity(requestFace, fileFace, j);
      results.push({
        requestFaceIndex: i,
        fileFaceIndex: j,
        ...comparison,
      });
    }
  }

  const bestMatches = data.measurements.map((_, index) => {
    const matches = results.filter((r) => r.requestFaceIndex === index);
    const bestMatch = matches.reduce((best, current) =>
      current.similarity > best.similarity ? current : best
    );
    return {
      requestFaceIndex: index,
      bestMatchFileIndex: bestMatch.fileFaceIndex,
      similarity: bestMatch.similarity,
      details: bestMatch.details,
    };
  });

  const verificationResults = bestMatches.map((match) => {
    const thresholds = {
      0: 98,
      1: 98,
      2: 98,
      3: 98,
    };

    return {
      requestFaceIndex: match.requestFaceIndex,
      bestMatchFileIndex: match.bestMatchFileIndex,
      similarity: match.similarity,
      verified: match.similarity >= thresholds[match.bestMatchFileIndex],
      threshold: thresholds[match.bestMatchFileIndex],
    };
  });

  const verified =
    verificationResults.filter((result) => result.verified).length >= 4;

  if (!verified) {
    return badRequest(
      "Gagal melakukan absensi, pengenalan wajah tidak sesuai, Silahkan coba lagi!"
    );
  }

  const previousAttendance = await prisma.attendance.findFirst({
    where: {
      user_id: Number(id),
      created_at: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(),
      },
    },
  });

  if (!previousAttendance) {
    await prisma.attendance.create({
      data: {
        user_id: Number(id),
        lat,
        long,
        type: "Alpa",
        image: "",
        institution_id: existingUser.userInstitutions[0].institution_id,
      },
    });
  }

  const attendance = await prisma.attendance.create({
    data: {
      user_id: Number(id),
      lat,
      long,
      type: "Present",
      image: file.filename,
    },
  });

  return attendance;
};

const getAll = async (req) => {
  const { id } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const where = {
    user_id: Number(id),
  };

  const data = await paginate(where, page, limit, prisma.attendance, {
    include: {
      user: true,
    },
  });

  return data;
};

const getOne = async (req) => {
  const { id } = req.user;
  const { id: attendanceId } = req.params;

  const attendance = await prisma.attendance.findUnique({
    where: {
      id: Number(attendanceId),
      user_id: Number(id),
    },
  });

  return attendance;
};

module.exports = {
  create,
  getAll,
  getOne,
};
