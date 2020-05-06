const ServiceDonation = require("../../service/donation");

const papaparse = require("papaparse");
const axios = require("axios");
const logger = require("../../logger");

const CHIFFRES_LP =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSG70iKIq9h_QTuq0vh287JGaHx-W3h0jbPgl2SGvqJaqVZK5cgkLquEfnZqRGDIPWqlyk7ab87d6o3/pub?gid=0&single=true&output=csv";

const LISTE_LP =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSG70iKIq9h_QTuq0vh287JGaHx-W3h0jbPgl2SGvqJaqVZK5cgkLquEfnZqRGDIPWqlyk7ab87d6o3/pub?gid=2120014790&single=true&output=csv";

const getSpreadsheetData = async (url) => {
  const { data } = await axios.get(url);
  const { data: csvData, errors } = papaparse.parse(data, { header: true });
  if (errors.length > 0) logger.warn(errors);
  return csvData;
};

const getLandingData = async (req, res) => {
  const chiffresData = await getSpreadsheetData(CHIFFRES_LP);
  const listeData = await getSpreadsheetData(LISTE_LP);
  const donatorCount = await ServiceDonation.getDonatorCount();

  let mealCount = 0;
  let chefCount = 0;
  let benevoleCount = 0;
  chiffresData.forEach((chiffre) => {
    if (chiffre.NOM_VARIABLE === "Repas") {
      mealCount = chiffre.VALEUR;
    }
    if (chiffre.NOM_VARIABLE === "Chefs") {
      chefCount = chiffre.VALEUR;
    }
    if (chiffre.NOM_VARIABLE === "Bénévoles") {
      benevoleCount = chiffre.VALEUR;
    }
  });

  const partenaires = [];

  listeData.forEach((partenaire) =>
    partenaires.push({
      name: partenaire.NAME,
      url:
        partenaire.WEBSITE.trim().length > 0
          ? partenaire.WEBSITE.trim()
          : undefined,
    })
  );

  res.send({ donatorCount, mealCount, chefCount, benevoleCount, partenaires });
};

module.exports = { getLandingData };
