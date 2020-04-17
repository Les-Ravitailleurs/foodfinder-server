const logger = require("../logger");
const express = require("express");
const config = require("../config");
const router = require("./router");

const launchAPI = () => {
  const app = express();
  const port = config.API_PORT;

  app.use(express.json());

  app.use("/api", router);

  app.listen(port, () => {
    logger.info(`API running on port ${port}`);
  });
};

module.exports = {
  launchAPI,
};
