const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const mjml2html = require("mjml");
const Config = require("../config");

const mailjet = require("node-mailjet").connect(
  Config.MAILJET_API_KEY,
  Config.MAILJET_SECRET_KEY
);
const templates = {};

const getEmailSubject = (templateName, data) => {
  switch (templateName) {
    case "collecte":
      return "Votre collecte est en ligne !";

    case "donation":
      return `${data.__NAME__}, vous venez d'offrir ${data.__MEAL_COUNT__} repas`;

    case "donation_admin":
      return `${data.__DONATOR_NAME__} vient d'offrir des repas dans votre collecte`;

    case "donation_volunteer":
      return `${data.__DONATOR_NAME__} vient d'offrir des repas grâce à votre lien`;
    case "volunteer_link":
      return `${data.__NAME__}, ton lien Ravitailleurs a bien été créé`;

    default:
      throw new Error("EMAIL SUBJECT NOT FOUND");
  }
};

const getEmailFrom = (templateName) => {
  switch (templateName) {
    case "volunteer_link": {
      return {
        Email: "delphine.aim@lesravitailleurs.org",
        Name: "Delphine des Ravitailleurs",
      };
    }
    default: {
      return {
        Email: "contact@lesravitailleurs.org",
        Name: "Les Ravitailleurs",
      };
    }
  }
};

const sendEmail = async (templateName, to, data, attachment) => {
  const template = await getEmailTemplate(templateName);
  let { html, errors } = mjml2html(template);
  if (errors.length > 0) {
    throw new Error(errors);
  }
  for (const dataName in data) {
    html = html.replace(new RegExp(dataName, "g"), data[dataName]);
  }
  const subject = getEmailSubject(templateName, data);
  const messages = [
    {
      From: getEmailFrom(templateName),
      To: [
        {
          Email: to,
        },
      ],
      Subject: subject,
      HTMLPart: html,
    },
  ];

  if (attachment) {
    messages[0].Attachments = [attachment];
  }

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: messages,
    });
    logger.info(`Sent Email "${templateName}" to ${to}`);
  } catch (err) {
    console.log("IN HERE ERROR", err, JSON.stringify(err));
    logger.error(
      err,
      err && err.response && err.response.body && err.response.body.errors
    );
    throw err;
  }
};

const loadEmailTemplate = (template) =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "templates", `${template}.mjml`),
      "utf8",
      (err, contents) => {
        if (err) return reject(err);
        templates[template] = contents;
        resolve(contents);
      }
    );
  });

const getEmailTemplate = async (template) => {
  const compiled = templates[template] || (await loadEmailTemplate(template));
  return compiled;
};

module.exports = {
  sendEmail,
};
