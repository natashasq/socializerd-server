exports.errorHandler = (err, req, res, next) => {
  if (res.statusCode === 404) {
    return res.render('err', {
      message: "Not Found!",
      statusCode: res.statusCode
    });
  }
    res.render('err', {
    statusCode: 500,
    message: "Server Error"

  })
  next();
}
