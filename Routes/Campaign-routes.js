const express = require("express");

const campaignController = require("../controllers/campaign-controllers");

const router = express.Router();

router.post("/registercampaign", campaignController.register);
router.post("/logincampaign", campaignController.login);
router.post("/updatecampaigndata", campaignController.updateCampaignData);
router.post("/getcampaigndata", campaignController.getCampaignData);
router.post("/getcampaignfilterdata", campaignController.getCampaignFilterData);
router.get("/getnewcode", campaignController.getNewCode);
router.post("/getteammembers", campaignController.getTeamMembers);
router.post("/getteamadmin", campaignController.getTeamAdmin);
router.post(
  "/getcampaignteammembers",
  campaignController.getCampaignTeammembers
);

router.post("/updateprofile", campaignController.updateProfile);

module.exports = router;
