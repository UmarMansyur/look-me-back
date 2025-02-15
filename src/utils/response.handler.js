const success = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    status: true,
    message,
    data,
  });
};

const error = (res, message = "Internal server error", status = 500) => {
  return res.status(status).json({
    status: false,
    code: status,
    message: message,
  });
};

module.exports = {
    success,
    error
};
