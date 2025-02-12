const paginate = async (where, page, limit, model, include = undefined) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const data = await prisma[model].findMany({
    where,
    skip,
    take,
    include
  });

  const total = await prisma[model].count();

  return {
    total_data: Number(total),
    per_page: Number(limit),
    current_page: Number(page),
    data
  }
};


module.exports = {
  paginate
};
