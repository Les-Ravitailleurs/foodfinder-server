const wkhtmltopdf = require("wkhtmltopdf");
const fs = require("fs");
const moment = require("moment-timezone");
const writtenNumber = require("written-number");
const AWS = require("aws-sdk");
const Config = require("../../config");
const s3 = new AWS.S3({
  accessKeyId: Config.AWS_ACCESS_KEY_ID,
  secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
});

const generateTaxReceipt = ({
  taxReceiptId,
  taxReceiptNumber,
  donatorName,
  donatorAddress,
  amount,
}) =>
  new Promise((resolve, reject) => {
    let html = fs.readFileSync(`${__dirname}/model/index.html`, "utf8");
    html = html.replace("VARIABLE_NUMERO", taxReceiptNumber);
    html = html.replace("VARIABLE_NOM_COMPLET", donatorName);
    html = html.replace("VARIABLE_ADRESSE", donatorAddress);
    const date = moment().tz("Europe/Paris").format("DD/MM/YYYY");
    html = html.replace(/VARIABLE_DATE_VERSEMENT/g, date);
    html = html.replace("VARIABLE_MONTANT_CHIFFRES", `${amount / 100}€`);
    html = html.replace(
      "VARIABLE_MONTANT_LETTRES",
      `${writtenNumber(amount / 100, { lang: "fr" })} euros`.toUpperCase()
    );
    html = html.replace("VARIABLE_DATE_EMISSION", date);

    const htmlFilePath = `${__dirname}/model/${taxReceiptId}.html`;
    fs.writeFileSync(htmlFilePath, html, "utf8");
    const fullpath = `file:///${__dirname}/model/${taxReceiptId}.html`;
    const outPath = `${__dirname}/model/${taxReceiptId}.pdf`;

    const stream = wkhtmltopdf(fullpath, {
      pageSize: "letter",
      enableLocalFileAccess: true,
    }).pipe(fs.createWriteStream(outPath));
    stream.on("finish", () => {
      fs.unlinkSync(htmlFilePath);
      resolve(outPath);
    });
    stream.on("error", reject);
  });

const generateTaxReceiptAndUpload = ({
  taxReceiptId,
  taxReceiptNumber,
  donatorName,
  donatorAddress,
  amount,
}) =>
  new Promise((resolve, reject) => {
    generateTaxReceipt({
      taxReceiptId,
      taxReceiptNumber,
      donatorName,
      donatorAddress,
      amount,
    })
      .then((pdfPath) => {
        const S3Params = {
          Bucket: Config.AWS_BUCKET,
          Key: `taxReceipts/${taxReceiptId}.pdf`,
          Body: fs.readFileSync(pdfPath),
          ContentType: "application/pdf",
          ACL: "public-read",
          ContentDisposition: `attachment; filename ="${taxReceiptNumber} Recu Fiscal Les Ravitailleurs.pdf"`,
        };
        s3.upload(S3Params, function (err, data) {
          if (err) {
            return reject(err);
          }
          // Now that done, resolve with location
          // and base64
          const base64 = fs.readFileSync(pdfPath, { encoding: "base64" });
          fs.unlinkSync(pdfPath);

          resolve({ taxReceiptURL: data.Location, taxReceiptBase64: base64 });
        });
      })
      .catch(reject);
  });

module.exports = { generateTaxReceiptAndUpload };
