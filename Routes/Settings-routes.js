const express = require("express");
const verifyToken = require("../middlewares/auth");
const settingsControllers = require("../controllers/settings-controllers");

const router = express.Router();

//Manage State Routes
router.get("/getstates", verifyToken, settingsControllers.getStates);
router.post("/addstate", verifyToken, settingsControllers.addState);

module.exports = router;
