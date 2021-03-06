const express = require("express");
const router = express.Router();

const poolController = require("./controllers/pool");
const donationController = require("./controllers/donation");
const landingController = require("./controllers/landing");
const volunteerController = require("./controllers/volunteer");
const dashboardController = require("./controllers/dashboard");

router.post("/pool", poolController.createOrEditPool);
router.get("/pool/:poolId", poolController.getPool);

router.get("/donation/:donationId", donationController.getDonation);
router.post("/donation", donationController.donate);
router.post("/saveEmail", donationController.saveEmail);
router.get("/landing", landingController.getLandingData);

router.get("/delivery/:volunteerId", volunteerController.getDeliveryData);
router.get("/dashboard/", dashboardController.getDashboardData);
router.post("/dashboard/increment", dashboardController.incrementLikeCount);
router.post("/volunteer", dashboardController.createVolunteer);

module.exports = router;
