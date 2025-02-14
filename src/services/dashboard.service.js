const prisma = require('../utils/db');

const adminDashboard = async () => {
  const totalInstitution = await prisma.institution.count();
  const totalUser = await prisma.user.count();
  const totalRole = await prisma.role.count();
  const totalHoliday = await prisma.holiday.count();

  const userPerInstitution = await prisma.userInstitution.groupBy({
    by: ['institution_id'],
    _count: true,
  });

  const userPerInstitutionData = await Promise.all(
    userPerInstitution.map(async (item) => {
      const institution = await prisma.institution.findUnique({
        where: { id: item.institution_id },
      });
      return {
        name: institution.name,
        count: item._count,
      };
    })
  );

  const latestUser = await prisma.user.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 5,
  });

  const latestInstitution = await prisma.institution.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 5,
  });

  return {
    total_institution: totalInstitution,
    total_user: totalUser,
    total_role: totalRole,
    total_holiday: totalHoliday,
    user_per_institution: userPerInstitutionData,
    latest_user: latestUser,
    latest_institution: latestInstitution,
  };
};

module.exports = {
  adminDashboard,
};

