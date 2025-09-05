function sendResponse(res, success, message, data = null, count = null, errors = null, error = null) {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  if (errors) response.errors = errors;
  if (error) response.error = error;
  return res.json(response);
}

module.exports = { sendResponse };
