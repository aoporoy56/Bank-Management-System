const Response = (res, status, reason, message, developerMessage, data) =>{
  res.status(status).json({
    status: status,
    reason: reason,
    message: message,
    developerMessage: developerMessage,
    data: data,
  });
}

exports.Response = Response;
