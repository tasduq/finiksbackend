const express = require("express");

const scriptController = require("../controllers/script-controllers");

const router = express.Router();

router.post("/createscript", scriptController.createScript);
router.post("/getscripts", scriptController.getScripts);
router.post("/deletescripts", scriptController.deleteScripts);
router.post("/editscripts", scriptController.editScripts);

module.exports = router;
