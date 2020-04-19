const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const stripeController = require("./controllers/stripe");

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeController.webhook
);

module.exports = router;
