const express = require("express");
const router = express.Router();

const poolController = require("./controllers/pool");
const donationController = require("./controllers/donation");

router.post("/pool", poolController.createPool);
router.get("/pool/:poolId", poolController.getPool);

router.get("/donation/:donationId", donationController.getDonation);
router.post("/donation", donationController.donate);

module.exports = router;
