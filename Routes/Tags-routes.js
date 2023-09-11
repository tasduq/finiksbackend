const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const tagsController = require("../controllers/tags-controllers");

const router = express.Router();

router.post("/addTag", verifyToken, tagsController.addTag);
router.post("/edittag", verifyToken, tagsController.editTag);
router.get("/gettags", verifyToken, tagsController.getTags);
router.post("/getclienttags", verifyToken, tagsController.getClientTags);
router.post("/gettaginfo", verifyToken, tagsController.getTagInfo);
router.post("/connecttagtouser", verifyToken, tagsController.connectTagToUser);
router.get("/gettagsbyclients", verifyToken, tagsController.getTagsByClients);
router.post("/mergetags", verifyToken, tagsController.mergeTags);
router.post("/deletetag", verifyToken, tagsController.deleteTag);

// router.post("/deletescripts", tagsController.deleteScripts);
// router.post("/editscripts", tagsController.editScripts);

module.exports = router;
