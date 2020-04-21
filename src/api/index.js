const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const logger = require("../logger");
const Config = require("../config");
const router = require("./router");
const webhooks = require("./webhooks");

const ServicePool = require("../service/pool");

const launchAPI = () => {
  const app = express();
  const port = Config.API_PORT;

  app.use(cors());

  // On prod, we want to serve
  // the app through express
  if (Config.ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "app-desktop")));
  }

  app.use("/webhooks", webhooks);
  app.use("/api", express.json());
  app.use("/api", router);

  if (Config.ENV === "production") {
    app.all("*", async (req, res) => {
      let poolId = null;
      let title = null;
      const regex1 = new RegExp("/collecte/(.*?)/");
      const regex2 = new RegExp("/collecte/(.*?)(\\?|$)");
      if (req.url.startsWith("/collecte/")) {
        const match1 = req.url.match(regex1);
        if (match1) {
          poolId = match1[1];
        } else {
          const match2 = req.url.match(regex2);
          if (match2) {
            poolId = match2[1];
          }
        }
      }
      if (poolId) {
        // Let's get title from pool name
        const pool = await ServicePool.getPool(poolId);
        title = `Aidez ${pool.creatorName} !`;
      }
      console.log(title);

      fs.readFile(
        path.join(__dirname, "..", "app-desktop", "index.html"),
        "utf8",
        function read(err, data) {
          if (err) {
            res.status(500).send(err);
          }
          // if (title) {
          //   // Let's replace title !
          //   data = data.replace(
          //     "<title>Les ravitailleurs</title>",
          //     `<title>${title}</title>`
          //   );
          // }
          res.status(200).send(data);
        }
      );
    });
  }

  app.listen(port, () => {
    logger.info(`API running on port ${port}`);
  });
};

module.exports = {
  launchAPI,
};
