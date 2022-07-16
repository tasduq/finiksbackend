const express = require("express");

const surveyController = require("../controllers/survey-controllers");

const router = express.Router();

router.post("/addsurvey", surveyController.addSurvey);
router.post("/getclientsurvey", surveyController.getClientSurvey);
router.post("/takesurvey", surveyController.connectSurveyToUser);

router.get("/getcampaigns", surveyController.getCampaigns);
router.post("/getcampaignsurveys", surveyController.getCampaignSurveys);
router.post(
  "/getcampaignsurveyresponses",
  surveyController.getCampaignSurveyResponses
);
// router.post("/deletescripts", surveyController.deleteScripts);
// router.post("/editscripts", surveyController.editScripts);

module.exports = router;
