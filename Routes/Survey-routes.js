const express = require("express");

const surveyController = require("../controllers/survey-controllers");

const router = express.Router();

router.post("/addsurvey", surveyController.addSurvey);
router.post("/editsurvey", surveyController.editSurvey);
router.post("/deletesurvey", surveyController.deleteSurvey);
router.post("/getclientsurvey", surveyController.getClientSurvey);
router.post("/takesurvey", surveyController.connectSurveyToUser);
router.post(
  "/takeSurveyCanvassingSinglePerson",
  surveyController.takeSurveyCanvassingSinglePerson
);
router.post("/donotcall", surveyController.doNotCall);
router.post("/wrongNumber", surveyController.wrongNumber);
router.post("/saveinteraction", surveyController.saveInteraction);

router.get("/getcampaigns", surveyController.getCampaigns);
router.post("/getcampaignsurveys", surveyController.getCampaignSurveys);
router.post(
  "/getcampaignsurveyresponses",
  surveyController.getCampaignSurveyResponses
);
// router.post("/deletescripts", surveyController.deleteScripts);
// router.post("/editscripts", surveyController.editScripts);

module.exports = router;
