const success = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    message,
    data,
  });
};

const error = (res, message = "Internal server error", status = 500) => {
  return res.status(status).json({
    message,
  });
};

module.exports = {
    success,
    error
};
