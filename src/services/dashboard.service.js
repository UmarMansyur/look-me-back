const prisma = require('../utils/db');

const adminDashboard = async () => {
  const totalInstitution = await prisma.institution.count();
  const totalUser = await prisma.user.count();
  const totalRole = await prisma.role.count();
  const totalHoliday = await prisma.holiday.groupBy({
    by: ['event'],
    _count: true,
  });

  console.log(totalHoliday);

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
    total_holiday: totalHoliday.length,
    user_per_institution: userPerInstitutionData,
    latest_user: latestUser,
    latest_institution: latestInstitution,
  };
};

const headOfInstitutionDashboard = async (req) => {
  const { id: user_id } = req.user;

  const institution = await prisma.userInstitution.findFirst({
    where: {
      user_id: Number(user_id),
    },
  });

  const userInstitution = await prisma.userInstitution.findMany({
    where: {
      institution_id: institution.institution_id,
    },
  });

  const totalEmployee = await prisma.user.count({
    where: {
      userInstitutions: {
        some: {
          institution_id: institution.institution_id,
        },
      },
      userRoles: {
        some: {
          role: {
            name: 'Pegawai',
          }
        }
      }
    },
  });

  const totalHoliday = await prisma.holiday.groupBy({
    by: ['event'],
    where: {
      institution_id: institution.institution_id,
    },
    _count: true,
  });

  const totalAbsenToday = await prisma.attendance.count({
    where: {
      institution_id: institution.institution_id,
      check_in: {
        gte: new Date(),
        lt: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
    },
  });

  const totalPermission = await prisma.permissionRequest.findMany({
    where: {
      user_id: {
        in: userInstitution.map((item) => item.user_id),
      },
    },
    select: {
      status: true,
    },
  });

  const totalPermissionPendingRevised = totalPermission.filter((item) => item.status === 'Pending' || item.status === 'Revised');

  const totalPermissionApproved = totalPermission.filter((item) => item.status === 'Approved');

  const totalPermissionRejected = totalPermission.filter((item) => item.status === 'Rejected');

  const totalHolidayThisMonth = await prisma.holiday.count({
    where: {
      institution_id: institution.institution_id,
      start_date: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        lt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      end_date: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        lt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    },
  });

  return {
    total_employee: totalEmployee,
    total_holiday: totalHoliday.length,
    total_absen_today: totalAbsenToday,
    total_permission_pending_revised: totalPermissionPendingRevised.length,
    total_permission_approved: totalPermissionApproved.length,
    total_permission_rejected: totalPermissionRejected.length,
    total_holiday_this_month: totalHolidayThisMonth,
  };
};

module.exports = {
  adminDashboard,
  headOfInstitutionDashboard,
};

