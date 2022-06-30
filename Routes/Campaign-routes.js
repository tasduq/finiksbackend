const express = require("express");

const campaignController = require("../controllers/campaign-controllers");

const router = express.Router();

router.post("/registercampaign", campaignController.register);
router.post("/logincampaign", campaignController.login);
router.post("/updatecampaigndata", campaignController.updateCampaignData);
router.post("/getcampaigndata", campaignController.getCampaignData);
router.get("/getnewcode", campaignController.getNewCode);
router.post("/getteammembers", campaignController.getTeamMembers);

module.exports = router;
