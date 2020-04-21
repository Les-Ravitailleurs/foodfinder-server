const fs = require("fs");
const path = require("path");
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

    default:
      throw new Error("EMAIL SUBJECT NOT FOUND");
  }
};

const sendEmail = async (templateName, to, data) => {
  const template = await getEmailTemplate(templateName);
  let { html, errors } = mjml2html(template);
  if (errors.length > 0) {
    throw new Error(errors);
  }
  for (const dataName in data) {
    html = html.replace(new RegExp(dataName, "g"), data[dataName]);
  }
  const subject = getEmailSubject(templateName, data);

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "contact@lesravitailleurs.org",
            Name: "Les Ravitailleurs",
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });
    console.log(`Sent Email "${templateName}" to ${to}`);
  } catch (err) {
    console.log(
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
