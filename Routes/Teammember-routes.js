const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const teammemberController = require("../controllers/teammember-controllers");

const router = express.Router();

router.post("/registerteammember", teammemberController.register);
router.post("/loginteammember", teammemberController.login);
router.post("/inviteteammember", verifyToken, teammemberController.sendInvite);
router.post("/editteammember", verifyToken, teammemberController.editMember);
router.post("/joincampaign", verifyToken, teammemberController.joinCampaign);
router.post(
  "/getjoinedcampaigns",
  verifyToken,
  teammemberController.getJoinedCampaigns
);
router.post(
  "/getteamphonebankrecords",
  verifyToken,
  teammemberController.getTeamPhonebankRecords
);
router.post("/emailverify", teammemberController.emailVerify);
router.post("/newotp", teammemberController.requestNewEmailOtp);
router.post("/getlist", verifyToken, teammemberController.getList);
router.post("/getscript", verifyToken, teammemberController.getScript);
router.post("/gettags", verifyToken, teammemberController.getTags);
router.get("/getadmintags", verifyToken, teammemberController.getAdminTags);
router.post("/getsurvey", verifyToken, teammemberController.getSurvey);
router.post("/newpassword", teammemberController.newPassword);
router.post(
  "/updatepassword",
  verifyToken,
  teammemberController.updateUserPassword
);
router.post("/addtoteam", verifyToken, teammemberController.addToTeam);
router.post(
  "/getinvitedvoters",
  verifyToken,
  teammemberController.getInvitedVoters
);
router.post(
  "/getinvitedteammembers",
  verifyToken,
  teammemberController.getInvitedTeamMembers
);
router.post(
  "/updatevoterinfo",
  verifyToken,
  teammemberController.updateVoterInfo
);
router.post(
  "/updatevoterinfofromcanvassingsingleperson",
  verifyToken,
  teammemberController.updateVoterInfoFromCanvassingSinglePerson
);
router.post("/cancelinvite", verifyToken, teammemberController.cancelInvite);
// router.post("/getcampaigns", teammemberController.getCampaigns);
// router.post("/updatecampaigndata", campaignController.updateCampaignData);
// router.post("/getcampaigndata", campaignController.getCampaignData);
// router.get("/getnewcode", campaignController.getNewCode);

module.exports = router;
