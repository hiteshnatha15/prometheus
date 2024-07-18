const middleware = (req, res, next) => {
  const startTime = Date.now();
  next();
  const endTime = Date.now();
  console.log("Time Taken: ", endTime - startTime);
};

module.exports = middleware;
