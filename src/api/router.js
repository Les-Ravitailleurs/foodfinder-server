const express = require("express");
const router = express.Router();

const poolController = require("./controllers/pool");
const donationController = require("./controllers/donation");
const stripeController = require("./controllers/stripe");

router.post("/pool", poolController.createPool);
router.get("/pool/:poolId", poolController.getPool);

router.post("/donation", donationController.donate);

router.post("/stripeHook", stripeController.webhook);

module.exports = router;
