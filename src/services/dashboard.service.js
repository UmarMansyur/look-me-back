const { notFound } = require('../utils/api.error');
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

const getEmployeeDashboard = async (req) => {
  const { id: user_id } = req.user;

  const user = await prisma.user.findUnique({
    where: { id: Number(user_id) },
  });

  if(!user) {
    return notFound('Pengguna tidak ditemukan');
  }

  const userInstitution = await prisma.userInstitution.findFirst({
    where: { user_id: Number(user_id) },
  });

  if(!userInstitution) {
    return notFound('Pengguna tidak ditemukan');
  }

  const todayPresent = await prisma.attendance.findFirst({
    where: {
      institution_id: userInstitution.institution_id,
      user_id: Number(user_id),
      check_in: {
        gte: new Date(),
        lt: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
    },
  });

  // total present month
  const total_present = await prisma.attendance.count({
    where: {
      institution_id: userInstitution.institution_id,
      user_id: Number(user_id),
      type: 'Present',
      check_in: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        lt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    },
  });

  const total_permission = await prisma.permissionRequest.count({
    where: {
      user_id: Number(user_id),
      status: 'Approved',
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

  const total_kehadiran_tahunan = await prisma.attendance.findMany({
    where: {
      institution_id: userInstitution.institution_id,
      user_id: Number(user_id),
      check_in: {
        gte: new Date(new Date().setYear(new Date().getFullYear() - 1)),
        lt: new Date(new Date().setYear(new Date().getFullYear() + 1)),
      },
    },
  });



  // group by month check_in jika tidak ada check_in maka dianggap 0
  const total_kehadiran_tahunan_group_by_month = total_kehadiran_tahunan.reduce((acc, curr) => {
    const month = new Date(curr.check_in).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // format jsonn { name: 1, value: 1 }, { name: 2, value: 2 }
  const total_kehadiran_tahunan_group_by_month_formatted = Object.entries(total_kehadiran_tahunan_group_by_month).map(([key, value]) => ({ name: Number(key - 1), value }));

  for (let i = 0; i <= 11; i++) {
    if (!total_kehadiran_tahunan_group_by_month_formatted.find((item) => item.name === i)) {
      total_kehadiran_tahunan_group_by_month_formatted.push({ name: i, value: 0 });
    }
  }

  total_kehadiran_tahunan_group_by_month_formatted.sort((a, b) => a.name - b.name);
  
  const history_kehadiran = await prisma.attendance.findMany({
    where: {
      institution_id: userInstitution.institution_id,
      user_id: Number(user_id),
    },
    orderBy: {
      check_in: 'desc',
    },
    take: 5,
  });
  

  return {
    today_present: { 
      check_in: todayPresent?.check_in ? new Date(todayPresent?.check_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : null,
      check_out: todayPresent?.check_out ? new Date(todayPresent?.check_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : null,
    },
    total_kehadiran: total_present ? total_present : 0,
    total_permission: total_permission ? total_permission : 0,
    kehadiran_tahunan: total_kehadiran_tahunan_group_by_month_formatted,
    history_kehadiran: history_kehadiran.map((item) => ({
      check_in: new Date(item.check_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) || '-',
      check_out: new Date(item.check_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) || '-',
      type: item.type,
      tanggal: new Date(item.check_in).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) || '-',
    })),
  };
};

module.exports = {
  adminDashboard,
  headOfInstitutionDashboard,
  getEmployeeDashboard,
};

