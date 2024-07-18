const client = require("prom-client");
const { activeRequestsGauge } = require("./gauge");
const httpRequestsDurationMicroseconds = require("./histogram");

const counter = new client.Counter({
  name: "node_request_operations_total",
  help: "The total number of processed requests",
  labelNames: ["method", "route", "status_code"],
});

const requestCountMiddleware = (req, res, next) => {
  const startTime = Date.now();
  activeRequestsGauge.inc();
  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    counter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
    httpRequestsDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        code: res.statusCode,
      },
      duration
    );
    activeRequestsGauge.dec();
  });
  next();
};

module.exports = requestCountMiddleware;
