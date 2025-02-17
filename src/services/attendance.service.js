const { badRequest } = require("../utils/api.error");
const prisma = require("../utils/db");
const { paginate } = require("../utils/pagination");
const moment = require("moment");
const _ = require("lodash");
const xlsx = require("node-xlsx");
const Excel = require('exceljs');

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

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

const myFace = async (req) => {
  const { id } = req.user;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  
  if (!existingUser) {
    return badRequest("User tidak ditemukan!");
  }

  return existingUser.description;
}

const saveFace = async (req) => {
  const { id } = req.user;
  const { data } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  if(!existingUser) {
    return badRequest("User tidak ditemukan!");
  }

  let description = JSON.parse(data);



  await prisma.user.update({
    where: { id: Number(id) },
    data: {
      description: description.measurements,
    },
  });
}

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

  const faceInput = JSON.parse(data);

  if (!faceInput || !faceInput.measurements || faceInput.measurements.length === 0) {
    return badRequest("Data tidak boleh kosong!");
  }

  const fileData =existingUser.description;

  const distance = getDistance(
    existingUser.userInstitutions[0].institution.lat,
    existingUser.userInstitutions[0].institution.long,
    lat,
    long
  );

  console.log(distance);

  if (distance > 1) {
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

  if (existingAttendance.check_in && existingAttendance.check_out) {
    return badRequest("Anda sudah melakukan absensi hari ini!");
  }

  const results = [];

  for (let i = 0; i < faceInput.measurements.length; i++) {
    const requestFace = faceInput.measurements[i];

    for (let j = 0; j < fileData.length; j++) {
      const fileFace = fileData[j];
      const comparison = calculateFaceSimilarity(requestFace, fileFace, j);
      results.push({
        requestFaceIndex: i,
        fileFaceIndex: j,
        ...comparison,
      });
    }
  }

  const bestMatches = faceInput.measurements.map((_, index) => {
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
      0: 80,
      1: 80,
      2: 80,
      3: 80,
    };

    return {
      requestFaceIndex: match.requestFaceIndex,
      bestMatchFileIndex: match.bestMatchFileIndex,
      similarity: match.similarity,
      verified: match.similarity >= 80,
      threshold: 80,
    };
  });


  const verified =
    verificationResults.filter((result) => result.verified).length >= 4;


  if (!verified) {
    return badRequest(
      "Gagal melakukan absensi, pengenalan wajah tidak sesuai, Silahkan coba lagi!"
    );
  }

  if(file) {
    image = file.filename;
  }

  // ambil jam sekarang
  const now = new Date();
  const checkIn = new Date(now.setHours(now.getHours() + 7));
  const checkOut = new Date(now.setHours(now.getHours() + 15));

  const operating = await prisma.operatingHours.findFirst({
    where: {
      institution_id: existingUser.userInstitutions[0].institution_id,
      status: true,
    },
  });

  if(!operating) {
    return badRequest("Kantor tidak buka!");
  }

  
  let timeCheckIn = "";
  let timeCheckOut = "";

  // Check if this is a check-in or check-out attempt
  if (!existingAttendance || !existingAttendance.check_in) {
    // This is a check-in attempt
    if (now >= operating.start_time && now <= operating.late_tolerance) {
      timeCheckIn = new Date();
    } else if (now > operating.late_tolerance) {
      timeCheckIn = new Date();
    } else {
      return badRequest("Belum waktunya check in!");
    }
  } else {
    // This is a check-out attempt
    if (now >= operating.end_time && now <= operating.early_tolerance) {
      timeCheckOut = new Date();
    } else if (now > operating.early_tolerance) {
      timeCheckOut = new Date();
    } else {
      return badRequest("Belum waktunya check out!");
    }
  }

  const attendance = await prisma.attendance.create({
    data: {
      institution_id: existingUser.userInstitutions[0].institution_id,
      user_id: Number(id),
      lat: `${lat}`,
      long: `${long}`,
      check_in: timeCheckIn || null,
      check_out: timeCheckOut || null,
      type: "Present",
      images: file ? file.filename : "",
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

const reportAttendance = async (req) => {
  const { id } = req.user;
  const { month = moment().month() + 1, year = moment().year() } = req.query;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(id),
    },
  });

  const userInstitution = await prisma.userInstitution.findMany({
    where: {
      institution_id: Number(institution.institution_id),
    },
  });

  const listUser = await prisma.user.findMany({
    where: {
      id: {
        in: userInstitution.map((i) => i.user_id),
      },
    },
  });

  const currentYear = year ? year : moment().year();

  const startDate = new Date(currentYear, month - 1, 1);
  const endDate = new Date(currentYear, month, 0);

  const listAttendance = await prisma.attendance.findMany({
    where: {
      user_id: {
        in: listUser.map((user) => user.id)
      },
      check_in: {
        gte: startDate,
        lt: endDate
      }
    },
    include: {
      user: true
    }
  });

  const result = [];

  const listHoliday = await prisma.$queryRaw`
    SELECT * FROM holidays
    WHERE institution_id = ${institution.institution_id}
    AND YEAR(start_date) = ${year}
    AND MONTH(start_date) = ${month}
  `;


  listUser.forEach((user) => {
    const currentDate = moment(startDate);
    const lastDate = moment(endDate);
    
    while (currentDate.isSameOrBefore(lastDate)) {
      const isHoliday = currentDate.isoWeekday() === 7 || listHoliday.some(holiday => 
        moment(holiday.start_date).isSame(currentDate, "day")
      );

      const attendance = listAttendance.find(
        (attendance) => 
          attendance.user_id === user.id && 
          moment(attendance.check_in).isSame(currentDate, "day")
      );

      let type = "";

      if (isHoliday) {
        type = "Libur"; // Empty string for holidays
      } else if(attendance && attendance.type === "Present") {
        type = "Hadir";
      } else if(attendance && attendance.type === "Izin") {
        type = "Izin";
      } else if (attendance && attendance.type === "Sickness") {
        type = "Sakit";
      } else if (attendance && attendance.type === "Leave") {
        type = "Cuti";
      } else {
        type = "Alpa";
      }

      result.push({
        user_id: user.id,
        name: user.username,
        isHoliday,
        type,
        date: currentDate.format("DD-MM-YYYY"),
      });

      currentDate.add(1, "day");
    }
  });

  const groupedResult = _.groupBy(result, "name");
  const data = Object.keys(groupedResult).map((key) => ({
    name: key,
    total_present: groupedResult[key].filter((item) => item.type === "Hadir").length,
    total_permission: groupedResult[key].filter((item) => item.type === "Izin").length,
    total_sickness: groupedResult[key].filter((item) => item.type === "Sakit").length,
    total_leave: groupedResult[key].filter((item) => item.type === "Cuti").length,
    total_alpa: groupedResult[key].filter((item) => item.type === "Alpa").length - groupedResult[key].filter((item) => item.isHoliday).length,
    data: groupedResult[key],
  }));

  return {
    start_date: startDate,
    end_date: endDate,
    total_days: moment(endDate).diff(moment(startDate), "days") + 1,
    data,
  };
};

const exportAttendance = async (req) => {
  try {
    req.user = { id: req.query.id };
    const data = await reportAttendance(req);
    
    if (!data) return null;

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    // Define custom colors
    const colors = {
      header: '4472C4',
      subHeader: '8EA9DB',
      present: 'E2EFDA',
      absent: 'FFE6E6',
      holiday: 'FFF2CC',
      summary: 'E7E6E6'
    };

    // Headers setup
    const headers = ["Nama", "Tanggal Kehadiran", "Rekapitulasi"];
    const subHeaders = [
      '',
      ...Array.from({ length: data.total_days }, (_, i) => 
        moment(data.start_date).add(i, "days").format("DD-MM-YYYY")
      ),
      "Hadir", "Izin", "Sakit", "Cuti", "Alpa"
    ];

    // Add and style headers
    worksheet.addRow(headers);
    worksheet.addRow(subHeaders);

    // Merge header cells
    worksheet.mergeCells(1, 2, 1, data.total_days + 1); // Tanggal Kehadiran
    worksheet.mergeCells(1, data.total_days + 2, 1, data.total_days + 6); // Rekapitulasi

    // Style functions
    const applyHeaderStyle = (row, color) => {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color }
        };
        cell.font = {
          color: { argb: 'FFFFFF' },
          bold: true,
          size: 11
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    };

    // Apply styles to headers
    applyHeaderStyle(worksheet.getRow(1), colors.header);
    applyHeaderStyle(worksheet.getRow(2), colors.subHeader);

    // Add and style data rows
    data.data.forEach((item) => {
      const row = worksheet.addRow([
        item.name,
        ...item.data.map(d => d.type),
        item.total_present,
        item.total_permission,
        item.total_sickness,
        item.total_leave,
        item.total_alpa
      ]);

      row.eachCell((cell, colNumber) => {
        // Base cell styling
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Attendance data styling
        if (colNumber > 1 && colNumber <= data.total_days + 1) {
          const dayData = item.data[colNumber - 2];
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { 
              argb: dayData.isHoliday ? colors.holiday :
                    dayData.type === 'Hadir' ? colors.present :
                    dayData.type === 'Alpa' ? colors.absent : 'FFFFFF'
            }
          };
        }
        
        // Summary columns styling
        if (colNumber > data.total_days + 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.summary }
          };
          cell.font = { bold: true };
        }
      });
    });

    // Set column widths
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    worksheet.getColumn(1).width = 25; // Name column wider

    // Freeze panes
    worksheet.views = [{ 
      state: 'frozen', 
      xSplit: 1, 
      ySplit: 2 // Freeze both header rows
    }];

    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw error;
  }
};

const exportPDF = async (req) => {
  req.user = { id: req.query.id };
  const data = await reportAttendance(req);
  return data;
};

module.exports = {
  create,
  getAll,
  getOne,
  reportAttendance,
  exportAttendance,
  exportPDF,
  myFace,
  saveFace,
};  
