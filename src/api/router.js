const express = require("express");
const router = express.Router();

const poolController = require("./controllers/pool");

router.post("/pool", poolController.createPool);

module.exports = router;
