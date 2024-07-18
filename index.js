const express = require("express");
const client = require("prom-client");
const middleware = require("./metrics/middleware");
const app = express();
const requestCountMiddleware = require("./metrics/counter");

app.use(middleware);
app.use(requestCountMiddleware);

app.get("/users", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send("Hitesh Natha");
});

app.post("/users", (req, res) => {
  res.send("Hitesh Natha");
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000);
