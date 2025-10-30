function errorResponse(res, status, error, fieldErrors = []) {
  return res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    error,
    fieldErrors
  });
}

module.exports = { errorResponse };
