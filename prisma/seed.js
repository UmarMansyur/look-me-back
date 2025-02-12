const bcrypt = require("bcrypt");
async function main() {
  const user = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@lookme.com",
      phone: "081234567890",
      date_of_birth: new Date("2000-01-01"),
      address: "Jl. Admin",
      thumbnail: "admin.png",
      description: null,
      is_edit: false,
      password: await bcrypt.hash("admin", 10),
    },
  });

  const role = await prisma.role.createMany({
    data: [
      { name: "Administrator" },
      { name: "Kepala Pegawai" },
      { name: "Pegawai" },
    ],
  });

  const userRole = await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });

  const institution = await prisma.institution.create({
    data: {
      name: "PT. Admin",
      lat: "-6.2089",
      long: "106.8456",
      phone: "081234567890",
      email: "admin@lookme.com",
      address: "Jl. Admin",
      thumbnail: "admin.png",
    },
  });

  await prisma.userInstitution.create({
    data: {
      userId: user.id,
      institutionId: institution.id,
    },
  });

  await prisma.operatingHours.create({
    data: {
      institutionId: institution.id,
      start_time: "08:00",
      end_time: "17:00",
      status: true,
      late_tolerance: 15,
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
