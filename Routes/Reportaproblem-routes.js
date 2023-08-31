const express = require("express");

const reportaproblemController = require("../controllers/reportaproblem-controller");

const router = express.Router();

router.post("/submit", reportaproblemController.uploadScreenshots);

module.exports = router;
