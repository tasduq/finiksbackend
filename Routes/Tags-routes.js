const express = require("express");

const tagsController = require("../controllers/tags-controllers");

const router = express.Router();

router.post("/addTag", tagsController.addTag);
router.post("/edittag", tagsController.editTag);
router.get("/gettags", tagsController.getTags);
router.post("/gettaginfo", tagsController.getTagInfo);
router.post("/connecttagtouser", tagsController.connectTagToUser);
router.get("/gettagsbyclients", tagsController.getTagsByClients);
router.post("/mergetags", tagsController.mergeTags);

// router.post("/deletescripts", tagsController.deleteScripts);
// router.post("/editscripts", tagsController.editScripts);

module.exports = router;
