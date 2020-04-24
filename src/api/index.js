const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const Entities = require("html-entities").XmlEntities;

const logger = require("../logger");
const Config = require("../config");
const router = require("./router");
const webhooks = require("./webhooks");

const ServicePool = require("../service/pool");
const entities = new Entities();

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
      let pool = null;
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
        pool = await ServicePool.getPool(poolId);
      }

      fs.readFile(
        path.join(__dirname, "..", "app-desktop", "index.html"),
        "utf8",
        function read(err, data) {
          if (err) {
            res.status(500).send(err);
          }
          if (pool && data && data.replace) {
            const title = entities.encode(
              `Aidez ${pool.creatorName} à collecter des repas pour les plus démunis`
            );
            data = data.replace(
              "<title>Les Ravitailleurs</title>",
              `<title>${title}</title>`
            );
            data = data.replace(
              `<meta property="og:title" content="Les Ravitailleurs"/>`,
              `<meta property="og:title" content="${title}"/>`
            );

            data = data.replace(
              `<meta property="og:url" content="https://lesravitailleurs.org/"/>`,
              `<meta property="og:url" content="${Config.BASE_URL}/collecte/${pool.id}"/>`
            );

            const newDescription = `Les plus démunis ont besoin, aujourd’hui plus que jamais, d’aide alimentaire. ${entities.encode(
              pool.creatorName
            )} a créé une collecte pour aider Les Ravitailleurs à cuisiner des milliers de repas pour eux.`;

            data = data.replace(
              `<meta property="og:description" content="Aidez-nous à cuisiner des milliers de repas pour les plus démunis. Des milliers de personnes, en France, ne peuvent plus se nourrir au quotidien. Vous pouvez aider."/>`,
              `<meta property="og:description" content="${newDescription}"/>`
            );

            data = data.replace(
              `<meta name="description" content="Aidez-nous à cuisiner des milliers de repas pour les plus démunis. Des milliers de personnes, en France, ne peuvent plus se nourrir au quotidien. Vous pouvez aider." />`,
              `<meta name="description" content="${newDescription}" />`
            );

            if (pool.shareImage) {
              data = data.replace(
                `https://lesravitailleurs.s3.eu-west-3.amazonaws.com/ravitailleursShare.jpg`,
                pool.shareImage
              );
            }
          }
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
