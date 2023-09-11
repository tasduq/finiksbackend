const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const scriptController = require("../controllers/script-controllers");

const router = express.Router();

router.post("/createscript", verifyToken, scriptController.createScript);
router.post("/getscripts", verifyToken, scriptController.getScripts);
router.post("/deletescripts", verifyToken, scriptController.deleteScripts);
router.post("/editscripts", verifyToken, scriptController.editScripts);

module.exports = router;
