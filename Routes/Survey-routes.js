const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const surveyController = require("../controllers/survey-controllers");

const router = express.Router();

router.post("/addsurvey", verifyToken, surveyController.addSurvey);
router.post("/editsurvey", verifyToken, surveyController.editSurvey);
router.post("/deletesurvey", verifyToken, surveyController.deleteSurvey);
router.post("/getclientsurvey", verifyToken, surveyController.getClientSurvey);
router.post("/takesurvey", verifyToken, surveyController.connectSurveyToUser);
router.post(
  "/takeSurveyCanvassingSinglePerson",
  verifyToken,
  surveyController.takeSurveyCanvassingSinglePerson
);
router.post("/donotcall", verifyToken, surveyController.doNotCall);
router.post("/wrongNumber", verifyToken, surveyController.wrongNumber);
router.post("/saveinteraction", verifyToken, surveyController.saveInteraction);

router.get("/getcampaigns", verifyToken, surveyController.getCampaigns);
router.post(
  "/getcampaignsurveys",
  verifyToken,
  surveyController.getCampaignSurveys
);
router.post(
  "/getcampaignsurveyresponses",
  verifyToken,
  surveyController.getCampaignSurveyResponses
);
// router.post("/deletescripts", surveyController.deleteScripts);
// router.post("/editscripts", surveyController.editScripts);

module.exports = router;
