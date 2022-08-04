const express = require("express");

const teammemberController = require("../controllers/teammember-controllers");

const router = express.Router();

router.post("/registerteammember", teammemberController.register);
router.post("/loginteammember", teammemberController.login);
router.post("/inviteteammember", teammemberController.sendInvite);
router.post("/editteammember", teammemberController.editMember);
router.post("/joincampaign", teammemberController.joinCampaign);
router.post("/getjoinedcampaigns", teammemberController.getJoinedCampaigns);
router.post(
  "/getteamphonebankrecords",
  teammemberController.getTeamPhonebankRecords
);
router.post("/emailverify", teammemberController.emailVerify);
router.post("/newotp", teammemberController.requestNewEmailOtp);
router.post("/getlist", teammemberController.getList);
router.post("/getscript", teammemberController.getScript);
router.post("/gettags", teammemberController.getTags);
router.post("/getsurvey", teammemberController.getSurvey);
router.post("/newpassword", teammemberController.newPassword);
router.post("/updatepassword", teammemberController.updateUserPassword);
// router.post("/getcampaigns", teammemberController.getCampaigns);
// router.post("/updatecampaigndata", campaignController.updateCampaignData);
// router.post("/getcampaigndata", campaignController.getCampaignData);
// router.get("/getnewcode", campaignController.getNewCode);

module.exports = router;
