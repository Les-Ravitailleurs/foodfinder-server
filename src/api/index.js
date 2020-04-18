const express = require("express");
const path = require("path");
const cors = require("cors");

const logger = require("../logger");
const Config = require("../config");
const router = require("./router");

const launchAPI = () => {
  const app = express();
  const port = Config.API_PORT;

  app.use(cors());
  app.use(express.json());

  // On prod, we want to serve
  // the app through express
  if (Config.ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "app-desktop")));
  }

  app.use("/api", router);

  app.listen(port, () => {
    logger.info(`API running on port ${port}`);
  });
};

module.exports = {
  launchAPI,
};
