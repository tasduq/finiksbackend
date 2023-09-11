const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const campaignController = require("../controllers/campaign-controllers");

const router = express.Router();

router.post("/registercampaign", campaignController.register);
router.post("/logincampaign", campaignController.login);
router.post(
  "/updatecampaigndata",
  verifyToken,
  campaignController.updateCampaignData
);
router.post(
  "/getcampaigndata",
  verifyToken,
  campaignController.getCampaignData
);
router.post(
  "/getcampaignfilterdata",
  verifyToken,
  campaignController.getCampaignFilterData
);
router.get("/getnewcode", campaignController.getNewCode);
router.post("/getteammembers", verifyToken, campaignController.getTeamMembers);
router.post("/getteamadmin", verifyToken, campaignController.getTeamAdmin);
router.post(
  "/getcampaignteammembers",
  verifyToken,
  campaignController.getCampaignTeammembers
);

router.post("/updateprofile", verifyToken, campaignController.updateProfile);

module.exports = router;
