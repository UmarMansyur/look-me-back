const prisma = require('../utils/db');

const getAll = async (req) => {
  const { id } = req.user;
  
  const notification = await prisma.notification.findMany({
    where: {
      user_id: Number(id),
    },
    orderBy: {
      id: 'desc',
    },
  });

  return notification;
};

const readAll = async (req) => {
  const { id } = req.user;

  await prisma.notification.updateMany({
    where: { user_id: Number(id) },
    data: {
      is_read: true,
    },
  });
};  

const readOne = async (req) => {
  const { id } = req.user;
  const { id: notificationId } = req.params;

  await prisma.notification.update({
    where: { id: Number(notificationId), user_id: Number(id) },
    data: {
      is_read: true,
    },
  });
};


module.exports = {
  getAll,
  readAll,
  readOne,
};
