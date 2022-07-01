const Survey = require("../Models/Survey");
const Campaignsurvey = require("../Models/Campaignsurveys");
const Voter = require("../Models/Finiksdata");

const addSurvey = async (req, res) => {
  console.log(req.body);

  const {
    surveyName,
    surveyPreview,
    surveyQuestion,
    surveyAnswer,
    active,
    color,
  } = req.body;
  const createdSurvey = new Survey({
    surveyName,
    surveyPreview,
    surveyQuestion,
    surveyAnswer,
    active,
    color,
  });

  try {
    createdSurvey.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating Survey Failed",
        });
        return;
      } else {
        res.json({
          message: "Survey Saved ",
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Creating Survey Failed. Trying again latter",
    });
  }
};

const connectSurveyToUser = async (req, res) => {
  const {
    campaignId,
    campaignName,
    voterId,
    voterName,
    surveyData,
    voterAnswers,
  } = req.body;

  let foundCampaignSurvey = await Campaignsurvey.findOne({
    campaignOwnerId: campaignId,
  });

  if (foundCampaignSurvey) {
    let surveyTaken = foundCampaignSurvey.surveyTaken;
    console.log(surveyTaken, "Surveys Taken");

    // let newSurveysFound = surveyData.map((survey) => {
    //   let foundNew = surveyTaken.find(
    //     (surveyTakenAlready) => survey.surveyId !== surveyTakenAlready.surveyid
    //   );
    //   if (foundNew) {
    //     return foundNew;
    //   }
    // });
    let newSurveysFound = surveyData.filter((o1) =>
      surveyTaken.every((o2) => o1.surveyId !== o2.surveyId)
    );

    console.log(newSurveysFound, newSurveysFound.length, "New Survey Found");

    if (newSurveysFound?.length > 0) {
      newSurveysFound = newSurveysFound.map((newSurvey) => {
        return {
          ...newSurvey,
          responses: 1,
        };
      });
    }

    console.log(newSurveysFound, "New Survey Found after responses");

    let commonSurveys = surveyData.filter((o1) =>
      surveyTaken.some((o2) => o1.surveyId === o2.surveyId)
    );
    console.log(commonSurveys, "Common Survey");

    commonSurveys = commonSurveys?.map((survey) => {
      let responses = surveyTaken.find(
        (taken) => taken.surveyId === survey.surveyId
      );
      return {
        ...survey,
        responses: responses.responses + 1,
      };
    });

    console.log(commonSurveys, "Common Survey after responses added");

    let updatedSurveysTaken;

    if (commonSurveys?.length > 0 && newSurveysFound?.length > 0) {
      updatedSurveysTaken = [...commonSurveys, ...newSurveysFound];
      console.log(updatedSurveysTaken, "before concat");
      // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
    } else if (commonSurveys?.length > 0) {
      updatedSurveysTaken = [...commonSurveys];
      // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
    } else {
      updatedSurveysTaken = [...newSurveysFound];
      // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
    }

    console.log(updatedSurveysTaken, "Updated Survey Taken");

    var ids = new Set(updatedSurveysTaken.map((d) => d.surveyId));
    updatedSurveysTaken = [
      ...updatedSurveysTaken,
      ...surveyTaken.filter((d) => !ids.has(d.surveyId)),
    ];

    console.log(updatedSurveysTaken, "MERGEDDDDDD");

    let ad = Campaignsurvey.updateOne(
      {
        _id: foundCampaignSurvey._id,
      },

      {
        $set: {
          surveyTaken: updatedSurveysTaken,
        },
      },
      async (err) => {
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
        } else {
          let campaignFound = await Voter.findOne({ _id: voterId }, "surveys");
          console.log(campaignFound, "Voter found surveys");

          if (campaignFound) {
            campaignFound = campaignFound.surveys.find(
              (campaign) => campaign.campaignId === campaignId
            );
            console.log(campaignFound, "campaign found from voter surveys");
            console.log(voterAnswers);
            Voter.updateOne(
              { _id: voterId, "surveys.campaignId": campaignId },
              { $set: { "surveys.$.surveyAnswers": voterAnswers } },
              (err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: "Something went wrong",
                  });
                } else {
                  res.json({
                    success: true,
                    message: "Voter Data Updated",
                  });
                }
              }
            );
          } else {
            Voter.updateOne(
              { _id: voterId },
              {
                $push: {
                  surveys: {
                    campaignId,
                    campaignName,
                    surveyAnswers: voterAnswers,
                  },
                },
              },
              (err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: "Something went wrong",
                  });
                } else {
                  res.json({
                    success: true,
                    message: "Voter Data Updated",
                  });
                }
              }
            );
          }
        }
      }
    );
  } else {
    let updatedSurveyData = surveyData.map((survey) => {
      return {
        ...survey,
        responses: 1,
      };
    });
    const createdCampaignSurvey = new Campaignsurvey({
      campaignOwnerId: campaignId,
      campaignName,
      surveyTaken: updatedSurveyData,
    });

    try {
      createdCampaignSurvey.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            data: err,
            message: "Creating Survey Failed",
          });
          return;
        } else {
          Voter.updateOne(
            { _id: voterId },
            {
              $push: {
                surveys: {
                  campaignId,
                  campaignName,
                  surveyAnswers: voterAnswers,
                },
              },
            },
            (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Something went wrong",
                });
              } else {
                res.json({
                  message: "Campaign Survey Saved ",
                  success: true,
                });
              }
            }
          );
        }
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message: "Creating Survey Failed. Trying again latter",
      });
    }
  }
};

const getCampaignsSurveys = async (req, res) => {
  const campaignsSurveys = await Campaignsurvey.find({});

  if (campaignsSurveys) {
    res.json({
      success: true,
      campaignsSurveys: campaignsSurveys,
      message: "Campaigns Surveus Found",
    });
  }
};

module.exports = {
  addSurvey,
  connectSurveyToUser,
  getCampaignsSurveys,
};

// const {
//   campaignId,
//   campaignName,
//   voterId,
//   voterName,
//   surveyId,
//   surveyName,
//   surveyPreview,
//   surveyActiveStatus,
//   script,
//   surveyAns,
// } = req.body;

// try {
//   let foundCampaignSurvey = await Campaignsurvey.findOne({
//     campaignOwnerId: campaignId,
//   });
//   if (foundCampaignSurvey) {
//     let surveyTakenFound = foundCampaignSurvey.surveyTaken.find(
//       (surveyTaken) => surveyTaken.surveyId === surveyId
//     );

//     if (surveyTakenFound) {
//     } else {
//       let ad = Campaignsurvey.updateOne(
//         { _id: foundCampaignSurvey._id },

//         {
//           $push: {
//             survayTaken: {
//               surveyId,
//               surveyName,
//               surveyPreview,
//               surveyActiveStatus,
//               script,
//               responses: 1,
//             },
//           },
//         },
//         function (err, updatedTag) {
//           console.log(err);
//           if (err) {
//             res.json({
//               success: false,
//               message: "Something went wrong",
//             });
//             return;
//           } else {
//             console.log(updatedTag);
//             let voterSurveys = Voter.findOne({ _id: voterId }, "surveys");
//             let voterSurveyFound = voterSurveys.find(
//               (survey) => survey.campaignId === campaignId
//             );
//             if (voterSurveyFound) {
//               voterSurveyFound = {
//                 ...voterSurveyFound,
//                 voterAnswers: [
//                   ...voterSurveyFound.voterAnswers,
//                   {
//                     surveyId,
//                     surveyName,
//                     surveyPreview,
//                     surveyActiveStatus,
//                     script,
//                     surveyAns,
//                   },
//                 ],
//               };
//               voterSurveys =
//             }
//             Voter.updateOne(
//               { _id: voterId },
//               {
//                 $push: {
//                   voterTags: {
//                     campaignId,
//                     campaignName,
//                     subUserName,
//                     subUserId,
//                     voterId,
//                     voterName,
//                     recordType,
//                     geoLocation,
//                     date,
//                     time,
//                     tagId: foundTag._id,
//                     tagName: foundTag.tagName,
//                   },
//                 },
//               },
//               (err) => {
//                 if (err) {
//                   res.json({
//                     success: false,
//                     message: "Something went wrong",
//                   });
//                   return;
//                 } else {
//                   res.json({
//                     success: true,
//                     message: "Tag Updated",
//                   });
//                   return;
//                 }
//               }
//             );
//           }
//         }
//       );
//     }
//   }

//   console.log("done");
// } catch (err) {
//   console.log(err);
//   res.json({
//     success: false,
//     message: "Something went wrong",
//   });
//   return;
// }

// {
//   _id: foundCampaignSurvey._id,
//   "surveyTaken.surveyId": surveyTakenFound.surveyId,
// },
