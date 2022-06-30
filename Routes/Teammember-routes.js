const express = require("express");

const teammemberController = require("../controllers/teammember-controllers");

const router = express.Router();

router.post("/registerteammember", teammemberController.register);
router.post("/loginteammember", teammemberController.login);
router.post("/inviteteammember", teammemberController.sendInvite);
router.post("/joincampaign", teammemberController.joinCampaign);
// router.post("/updatecampaigndata", campaignController.updateCampaignData);
// router.post("/getcampaigndata", campaignController.getCampaignData);
// router.get("/getnewcode", campaignController.getNewCode);

module.exports = router;
