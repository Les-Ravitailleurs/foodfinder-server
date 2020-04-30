const papaparse = require("papaparse");
const axios = require("axios");
const moment = require("moment-timezone");
const logger = require("../logger");

const DELIVERY_CSV_DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHfbDds15gPsQBiZ1LU0iQA9DRE6_Ww54MBK_d7aNvhq-00hdIsp9BW2XP881JYyevEiEKnoJIXEul/pub?gid=1235485560&single=true&output=csv";

const getSpreadsheetData = async (url) => {
  const { data } = await axios.get(url);
  const { data: csvData, errors } = papaparse.parse(data, { header: true });
  if (errors.length > 0) logger.warn(errors);
  return csvData;
};

const isInTheFuture = (date) => {
  const nowParis = moment().tz("Europe/Paris");
  return moment(date, "DD/MM/YYYY").isSameOrAfter(nowParis, "day");
};

const getDeliveryData = async (volunteerId) => {
  let deliveryData = await getSpreadsheetData(DELIVERY_CSV_DATA_URL);
  let livreur = null;

  deliveryData = deliveryData.filter((r) => {
    if (r["Tool_ID (livreur)"] === volunteerId)
      livreur = livreur || r["Nom livreur"];
    return r["Tool_ID (livreur)"] === volunteerId && isInTheFuture(r.Date);
  });

  const tasks = deliveryData.map((row) => ({
    id: row["Tournee_ID"],
    date: row.Date,
    horaire: row.Horaire,
    planningId: row["Planning_ID"],
    contact: row["Contact / chef"],
    destinationId: row["Chef_ID / Asso_ID"],
    fullAddress: `${row["Adresse"]} ${row["Code Postal"]} ${row["Ville"]}`,
    complementAddress: row["Complément d'adresse"],
    comment: row["Commentaire"],
    phone: row["Telephone"],
    details: row["Détails"],
    deposer: row["Deposer"],
    recuperer: row["Recuperer"],
  }));
  return { livreur, tasks };
};

module.exports = { getDeliveryData };
