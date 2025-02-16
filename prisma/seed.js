const bcrypt = require("bcrypt");
const prisma = require("../src/utils/db");

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: "Administrator",
        password: await bcrypt.hash("admin", 10),
        email: "umar.ovie@gmail.com",
        phone: "6285230648617",
        date_of_birth: new Date("2000-01-01"),
        expired_otp: null,
        address:
          "Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465",
        thumbnail:
          "https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png",
        description: null,
        is_edit: false,
      },
      {
        username: "Kepala Pegawai",
        password: await bcrypt.hash("lookme123", 10),
        email: "umar@unira.ac.id",
        phone: "6285230648617",
        date_of_birth: new Date("2000-01-01"),
        expired_otp: null,
        address:
          "Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465",
        thumbnail:
          "https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png",
        description: null,
        is_edit: false,
      },
      {
        username: "Pegawai",
        password: await bcrypt.hash("lookme123", 10),
        email: "muhammadumarmansyur2001@gmail.com",
        phone: "6285230648617",
        date_of_birth: new Date("2000-01-01"),
        expired_otp: null,
        address:
          "Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465",
        thumbnail:
          "https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png",
        description: null,
        is_edit: false,
      },
    ],
  });

  await prisma.role.createMany({
    data: [
      { name: "Administrator" },
      { name: "Kepala Pegawai" },
      { name: "Pegawai" },
    ],
  });

  await prisma.userRole.createMany({
    data: [
      {
        user_id: 1,
        role_id: 1,
      },
      {
        user_id: 2,
        role_id: 2,
      },
      {
        user_id: 3,
        role_id: 3,
      },
    ],
  });

  const institution = await prisma.institution.create({
    data: {
      name: "Madrasah Al-Ghazali",
      lat: "-6.2089",
      long: "106.8456",
      phone: "6285230648617",
      email: "admin@lookme.com",
      address:
        "Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465",
      logo: "https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png",
    },
  });

  await prisma.userInstitution.createMany({
    data: [
      {
        user_id: 1,
        institution_id: institution.id,
      },
      {
        user_id: 2,
        institution_id: institution.id,
      },
      {
        user_id: 3,
        institution_id: institution.id,
      },
    ],
  });

  await prisma.operatingHours.create({
    data: {
      institution_id: institution.id,
      start_time: new Date("2024-01-01T08:00:00Z").toISOString(),
      end_time: new Date("2024-01-01T17:00:00Z").toISOString(),
      status: true,
      late_tolerance: 15,
    },
  });

  // attendance
  for (let i = 1; i <= 12; i++) {
    await prisma.attendance.create({
      data: {
        user_id: 3,
        institution_id: institution.id,
        check_in: `2024-${i < 10 ? `0${i}` : i}-01T08:00:00Z`,
        check_out: `2024-${i < 10 ? `0${i}` : i}-01T17:00:00Z`,
        lat: "-6.2089",
        long: "106.8456",
        type: "Present",
      },
    });
    await prisma.attendance.create({
      data: {
        user_id: 3,
        institution_id: institution.id,
        check_in: `2024-${i < 10 ? `0${i}` : i}-02T08:00:00Z`,
        check_out: `2024-${i < 10 ? `0${i}` : i}-02T17:00:00Z`,
        lat: "-6.2089",
        long: "106.8456",
        type: "Present",
      },
    });
    await prisma.attendance.create({
      data: {
        user_id: 3,
        institution_id: institution.id,
        check_in: `2024-${i < 10 ? `0${i}` : i}-03T08:00:00Z`,
        check_out: `2024-${i < 10 ? `0${i}` : i}-03T17:00:00Z`,
        lat: "-6.2089",
        long: "106.8456",
        type: "Present",
      },
    });
  }

  for (let i = 1; i <= 100; i++) {
    await prisma.warningLetter.create({
      data: {
        user_id: 3,
        sender_id: 1,
        title: `Warning Letter ${i}`,
        message: `Warning Letter ${i}`,
        is_read: false,
      },
    });
  }

  // membuat perizinan

  await prisma.permissionRequest.create({
    data: {
      user_id: 3,
      start_date: new Date(`2024-01-01T08:00:00Z`),
      end_date: new Date(`2024-01-01T17:00:00Z`),
      title: "Izin",
      desc: "Izin",
      type: "Permission",
    },
  });
  await prisma.permissionRequest.create({
    data: {
      user_id: 3,
      start_date: new Date(`2024-01-01T08:00:00Z`),
      end_date: new Date(`2024-01-01T17:00:00Z`),
      title: "Cuti",
      desc: "Cuti",
      type: "Leave",
    },
  });
  await prisma.permissionRequest.create({
    data: {
      user_id: 3,
      start_date: new Date(`2024-01-01T08:00:00Z`),
      end_date: new Date(`2024-01-01T17:00:00Z`),
      title: "Sakit",
      desc: "Sakit",
      type: "Sickness",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
