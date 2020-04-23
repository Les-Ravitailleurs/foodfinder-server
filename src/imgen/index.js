const path = require("path");
const Canvas = require("canvas");
const AWS = require("aws-sdk");
const Config = require("../config");

const s3 = new AWS.S3({
  accessKeyId: Config.AWS_ACCESS_KEY_ID,
  secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
});

function getFile(name) {
  return path.join(__dirname, "/", name);
}

Canvas.registerFont(getFile("DMSerifText-Regular.ttf"), {
  family: "DMSerifText-Regular",
});

const imgGen = (id, name) =>
  new Promise((resolve, reject) => {
    const canvas = Canvas.createCanvas(1200, 627);
    const ctx = canvas.getContext("2d");

    const Image = Canvas.Image;
    const img = new Image();
    img.src = getFile("ShareBG.jpg");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const text1 = "Collecte de";
    const text2 = name;

    ctx.fillStyle = "#020100";
    ctx.textAlign = "center";
    ctx.font = "47pt DMSerifText-Regular";
    ctx.lineWidth = 12;
    ctx.fillText(text1, 600, 320);

    ctx.fillText(text2, 600, 390);
    const fileName = `${id}.jpg`;

    canvas.toBuffer(
      (err, buf) => {
        if (err) return reject(err); // encoding failed
        const S3Params = {
          Bucket: "lesravitailleurs",
          CreateBucketConfiguration: {
            LocationConstraint: "eu-west-3",
          },
          Key: `collectes/${fileName}`,
          Body: buf,
          ContentType: "image/jpeg",
          ACL: "public-read",
        };
        s3.upload(S3Params, function (err, data) {
          if (err) {
            return reject(err);
          }
          resolve(data.Location);
        });
      },
      "image/jpeg",
      { quality: 0.95 }
    );
  });

module.exports = { imgGen };
