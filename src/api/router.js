const express = require("express");
const router = express.Router();

const poolController = require("./controllers/pool");
const donationController = require("./controllers/donation");

router.post("/pool", poolController.createOrEditPool);
router.get("/pool/:poolId", poolController.getPool);

router.get("/donation/:donationId", donationController.getDonation);
router.post("/donation", donationController.donate);
router.get("/landing", donationController.getDonatorCount);

module.exports = router;
