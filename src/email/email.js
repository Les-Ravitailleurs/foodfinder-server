const fs = require("fs");
const path = require("path");
const mjml2html = require("mjml");
const Config = require("../config");

const mailjet = require("node-mailjet").connect(
  Config.MAILJET_API_KEY,
  Config.MAILJET_SECRET_KEY
);
const templates = {};

const getEmailSubject = (templateName) => {
  switch (templateName) {
    case "collecte":
      return "Merci pour la création de votre collecte !";

    case "donation":
      return "Merci pour votre donation !";

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
  const subject = getEmailSubject(templateName);

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "collecte@lesravitailleurs.org",
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

sendEmail("collecte", "noe.malzieu@gmail.com", {
  __LINK__: "https://www.lesravitailleurs.org/cagnotte/A1b1C2z4r1t6",
  __NAME__: "Olivier",
});

module.exports = {
  sendEmail,
};
