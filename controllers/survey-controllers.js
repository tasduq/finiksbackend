const Survey = require("../Models/Survey");
const Campaignsurvey = require("../Models/Campaignsurveys");
const Voter = require("../Models/Finiksdata");
const Tag = require("../Models/Tag");
const Team = require("../Models/Teammember");
const List = require("../Models/List");
const Phonebank = require("../Models/Phonebanklists");
const { v4: uuidv4 } = require("uuid");

const addSurvey = async (req, res) => {
  console.log(req.body);

  const {
    surveyName,
    surveyPreview,
    surveyQuestion,
    surveyAnswers,
    active,
    color,
    campaignId,
    campaignName,
  } = req.body;

  if (campaignId && campaignName) {
    let foundCampaignSurvey = await Survey.findOne({
      campaignOwnerId: campaignId,
    });
    console.log(foundCampaignSurvey);
    if (foundCampaignSurvey) {
      Survey.updateOne(
        { campaignOwnerId: campaignId },
        {
          $set: {
            campaignName,
          },
          $push: {
            surveyQuestions: {
              surveyName,
              surveyPreview,
              surveyQuestion,
              surveyAnswers,
              active,
              color,
              surveyId: uuidv4(),
              responses: 0,
            },
          },
        },
        async (err) => {
          if (err) {
            res.json({
              message: "Survey Creation failed",
              success: false,
            });
            return;
          } else {
            res.json({
              message: "Survey Creation Successfully",
              success: true,
            });
            return;
          }
        }
      );
    } else {
      const createdSurvey = new Survey({
        surveyQuestions: [
          {
            surveyName,
            surveyPreview,
            surveyQuestion,
            surveyAnswers,
            active,
            color,
            surveyId: uuidv4(),
            responses: 0,
          },
        ],
        campaignOwnerId: campaignId,
        campaignName,
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
        return;
      }
    }
  } else {
    res.json({
      success: false,
      message: "Campaign Error",
    });
    return;
  }
};

const getCampaignSurveyResponses = async (req, res) => {
  const { campaignOwnerId, surveyId } = req.body;
  console.log(req.body);

  const voters = await Voter.find(
    {
      "surveys.campaignId": campaignOwnerId,
    },
    "surveys"
  );
  console.log(voters);

  let campaignSurvey = [];
  voters.map((voter) => {
    let foundCampaignSurvey = voter.surveys.find(
      (survey) => survey.campaignId === campaignOwnerId
    );

    console.log(foundCampaignSurvey, "hello");

    if (foundCampaignSurvey) {
      let foundSurveyResponses = foundCampaignSurvey?.surveyAnswers?.find(
        (surveyAnswer) => surveyAnswer.surveyId === surveyId
      );

      console.log(foundSurveyResponses, "foundSurveyResponses");

      if (foundSurveyResponses) {
        campaignSurvey = [...campaignSurvey, foundSurveyResponses];
      }
    }
  });
  console.log(campaignSurvey, "campaign surveys");

  if (campaignSurvey) {
    res.json({
      success: true,
      message: "Surveys Found",
      foundSurveys: campaignSurvey,
    });
  } else {
    res.json({
      success: false,
      message: "Surveys Not Found",
    });
  }
};

const connectSurveyToUser = async (req, res) => {
  console.log(req.body);
  const {
    campaignId,
    campaignName,
    voterId,
    voterName,
    surveyData,
    voterAnswers,
    recordType,
    geoLocation,
    date,
    time,
    subUserName,
    subUserId,
    tags,
    actions,
    contactedWay,
    list,
    recordId,
    totalNumbers,
  } = req.body;

  let tagsWithDetails = tags.map((tag) => {
    return {
      ...tag,
      recordType,
      geoLocation,
      date,
      time,
      subUserName,
      subUserId,
      campaignId,
      campaignName,
      voterId,
      voterName,
    };
  });

  console.log(tagsWithDetails);

  let foundCampaignSurvey = await Survey.findOne({
    campaignOwnerId: campaignId,
  });

  console.log(foundCampaignSurvey, "111111");

  if (surveyData.length > 0) {
    if (foundCampaignSurvey) {
      // let surveyQuestions = foundCampaignSurvey.surveyQuestions;
      // console.log(surveyQuestions, "Surveys Questions");

      // let newSurveysFound = surveyData.map((survey) => {
      //   let foundNew = surveyTaken.find(
      //     (surveyTakenAlready) => survey.surveyId !== surveyTakenAlready.surveyid
      //   );
      //   if (foundNew) {
      //     return foundNew;
      //   }
      // });
      // let newSurveysFound = surveyData.filter((o1) =>
      //   surveyTaken.every((o2) => o1.surveyId !== o2.surveyId)
      // );

      // console.log(newSurveysFound, newSurveysFound.length, "New Survey Found");

      // if (newSurveysFound?.length > 0) {
      //   newSurveysFound = newSurveysFound.map((newSurvey) => {
      //     return {
      //       ...newSurvey,
      //       responses: 1,
      //     };
      //   });
      // }

      // console.log(newSurveysFound, "New Survey Found after responses");

      // let commonSurveys = surveyData?.filter((o1) =>
      //   surveyQuestions.some((o2) => o1.surveyId === o2.surveyId)
      // );
      // console.log(commonSurveys, "Common Survey");

      // commonSurveys = commonSurveys?.map((survey) => {
      //   // let responses = surveyTaken.find(
      //   //   (taken) => taken.surveyId === survey.surveyId
      //   // );
      //   return {
      //     ...survey,
      //     responses: survey.responses + 1,
      //   };
      // });

      // console.log(commonSurveys, "Common Survey after responses added");

      foundCampaignSurvey = foundCampaignSurvey.surveyQuestions.map(
        (surveyOld) => {
          let yoo = surveyData.some(
            (survey) => survey.surveyId === surveyOld.surveyId
          );
          if (yoo) {
            return {
              ...surveyOld,
              responses: surveyOld.responses + 1,
            };
          } else {
            return surveyOld;
          }
        }
      );

      console.log(foundCampaignSurvey, "22222");

      // let updatedSurveysTaken;

      // if (commonSurveys?.length > 0 && newSurveysFound?.length > 0) {
      //   updatedSurveysTaken = [...commonSurveys, ...newSurveysFound];
      //   console.log(updatedSurveysTaken, "before concat");
      //   // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
      // } else if (commonSurveys?.length > 0) {
      //   updatedSurveysTaken = [...commonSurveys];
      //   // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
      // } else {
      //   updatedSurveysTaken = [...newSurveysFound];
      //   // updatedSurveysTaken = updatedSurveysTaken.concat(surveyTaken);
      // }

      // console.log(updatedSurveysTaken, "Updated Survey Taken");

      // var ids = new Set(updatedSurveysTaken.map((d) => d.surveyId));
      // updatedSurveysTaken = [
      //   ...updatedSurveysTaken,
      //   ...surveyTaken.filter((d) => !ids.has(d.surveyId)),
      // ];

      // console.log(updatedSurveysTaken, "MERGEDDDDDD");

      let ad = Survey.updateOne(
        {
          campaignOwnerId: campaignId,
        },

        {
          $set: {
            surveyQuestions: foundCampaignSurvey,
          },
        },
        async (err) => {
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
          } else {
            // let campaignFound = await Voter.findOne({ _id: voterId }, "surveys");
            // console.log(campaignFound, "Voter found surveys");

            // campaignFound = campaignFound.surveys.find(
            //   (campaign) => campaign.campaignId === campaignId
            // );
            // console.log(campaignFound, "campaign found from voter surveys");

            console.log(voterAnswers);
            let checkCampaignFound = await Voter.findOne(
              { _id: voterId },
              "surveys"
            );
            console.log(checkCampaignFound, "11111");
            checkCampaignFoundTest = checkCampaignFound.surveys.some(
              (campaign) => {
                return campaign.campaignId === campaignId;
              }
            );
            console.log(checkCampaignFoundTest, "22222");
            if (checkCampaignFoundTest) {
              checkCampaignFound = checkCampaignFound.surveys.map((survey) => {
                if (survey.campaignId.toString() === campaignId) {
                  return {
                    ...survey,
                    surveyAnswers: voterAnswers,
                    contactedWay,
                    recordType,
                  };
                } else {
                  survey;
                }
              });
            }

            Voter.updateOne(
              { _id: voterId },
              {
                ...(checkCampaignFoundTest && {
                  $push: {
                    voterTags: { $each: tagsWithDetails },
                  },
                  $set: {
                    lastInfluenced: new Date(),
                    surveys: checkCampaignFound,
                  },
                }),
                ...(checkCampaignFoundTest === false && {
                  $push: {
                    voterTags: { $each: tagsWithDetails },
                    surveys: {
                      campaignId,
                      campaignName,
                      surveyAnswers: voterAnswers,
                      contactedWay,
                      recordType,
                    },
                  },
                  $set: {
                    lastInfluenced: new Date(),
                  },
                }),
                // ...(checkCampaignFound)
                // $set: {
                //   // "surveys.$.surveyAnswers": voterAnswers,
                //   // "surveys.$.contactedWay": contactedWay,
                //   // "surveys.$.recordType": recordType,
                //   lastInfluenced: new Date(),
                // },
              },
              (err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: "Something went wrong",
                  });
                } else {
                  tagsWithDetails.map((tag, i) => {
                    Tag.updateOne(
                      { _id: tag.tagId },

                      {
                        $push: {
                          users: tag,
                        },
                      },
                      async function (err, updatedTag) {
                        console.log(err);
                        if (err) {
                          res.json({
                            success: false,
                            message: "Something went wrong",
                          });
                          return;
                        } else {
                          if (i === tagsWithDetails.length - 1) {
                            let member = await Team.findOne(
                              { _id: subUserId },
                              "campaignJoined"
                            );
                            console.log(member);

                            let campaignFound = member?.campaignJoined?.find(
                              (campaign) =>
                                campaign.campaignId.toString() ===
                                campaignId.toString()
                            );

                            // if(campaignFound){

                            // }

                            campaignFound = {
                              ...campaignFound,
                              votersInfluenced:
                                actions?.votersInfluenced === true
                                  ? campaignFound?.votersInfluenced + 1
                                  : campaignFound?.votersInfluenced
                                  ? campaignFound?.votersInfluenced
                                  : 0,

                              doorsKnocked:
                                actions?.doorsKnocked === true
                                  ? campaignFound?.doorsKnocked + 1
                                  : campaignFound?.doorsKnocked
                                  ? campaignFound?.doorsKnocked
                                  : 0,

                              votersSurveyed:
                                actions?.votersSurveyed === true
                                  ? campaignFound?.votersSurveyed + 1
                                  : campaignFound?.votersSurveyed
                                  ? campaignFound?.votersSurveyed
                                  : 0,

                              votersMessaged:
                                actions?.votersMessaged === true
                                  ? campaignFound?.votersMessaged + 1
                                  : campaignFound?.votersMessaged
                                  ? campaignFound?.votersMessaged
                                  : 0,

                              phonesCalled:
                                actions?.phonesCalled === true
                                  ? campaignFound?.phonesCalled + 1
                                  : campaignFound?.phonesCalled
                                  ? campaignFound?.phonesCalled
                                  : 0,
                            };

                            console.log(campaignFound);

                            member = member.campaignJoined.map(
                              (memberCampaignJoined) => {
                                if (
                                  memberCampaignJoined.campaignId.toString() ===
                                  campaignId.toString()
                                ) {
                                  console.log("in iffff");
                                  return campaignFound;
                                } else {
                                  console.log("in elseee");
                                  return memberCampaignJoined;
                                }
                              }
                            );

                            console.log(member);

                            Team.updateOne(
                              {
                                _id: subUserId,
                              },
                              {
                                $set: { campaignJoined: member },
                              },
                              async (err) => {
                                if (err) {
                                  res.json({
                                    success: false,
                                    message: "Voter Data Updation failed",
                                  });
                                } else {
                                  let listFound = await List.findOne({
                                    _id: list,
                                  });
                                  console.log(listFound);
                                  let voterFound = listFound?.voters?.find(
                                    (voter) => voter._id === voterId
                                  );
                                  console.log(
                                    voterFound,
                                    "voterFound",
                                    tagsWithDetails
                                  );
                                  List.update(
                                    {
                                      _id: list,
                                      "voters._id": voterId,
                                    },
                                    {
                                      $set: {
                                        "voters.$.voterTags": [
                                          ...voterFound?.voterTags,
                                          ...tagsWithDetails,
                                        ],
                                        "voters.$.lastInfluenced": new Date(),
                                      },
                                    },
                                    async (err) => {
                                      if (err) {
                                        console.log(err);
                                        res.json({
                                          success: false,
                                          message: "Error Updating Voter Tags",
                                        });
                                      } else {
                                        if (recordType === "phonebanking") {
                                          let recordFound =
                                            await Phonebank.findOne(
                                              { _id: recordId },
                                              "totalCalled"
                                            );

                                          Phonebank.updateOne(
                                            { _id: recordId },
                                            {
                                              $inc: { totalCalled: 1 },
                                              $set: {
                                                numbersLeft:
                                                  totalNumbers -
                                                  recordFound?.totalCalled,
                                              },
                                            },
                                            (err) => {
                                              if (err) {
                                                console.log(err);
                                                res.json({
                                                  success: false,
                                                  message:
                                                    "Error Updating Phonebank Record",
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
                                }
                              }
                            );

                            // console.log(updatedTag);
                          }
                        }
                      }
                    );
                  });
                }
              }
            );

            // else {
            //   Voter.updateOne(
            //     { _id: voterId },
            //     {
            //       $push: {
            //         surveys: {
            //           campaignId,
            //           campaignName,
            //           surveyAnswers: voterAnswers,
            //         },
            //         voterTags: tagsWithDetails,
            //       },
            //       $set: {
            //         lastInfluenced: new Date(),
            //       },
            //     },
            //     (err) => {
            //       if (err) {
            //         res.json({
            //           success: false,
            //           message: "Something went wrong",
            //         });
            //       } else {
            //         Tag.updateOne(
            //           { _id: tagId },

            //           {
            //             $push: {
            //               users: { $each: tagsWithDetails },
            //             },
            //           },
            //           function (err, updatedTag) {
            //             console.log(err);
            //             if (err) {
            //               res.json({
            //                 success: false,
            //                 message: "Something went wrong",
            //               });
            //               return;
            //             } else {
            //               console.log(updatedTag);
            //               res.json({
            //                 success: true,
            //                 message: "Voter Data Updated",
            //               });
            //             }
            //           }
            //         );
            //         // res.json({
            //         //   success: true,
            //         //   message: "Voter Data Updated",
            //         // });
            //       }
            //     }
            //   );
            // }
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: "Your Campaign Don't have surveys Yet.",
      });
      // let updatedSurveyData = surveyData.map((survey) => {
      //   return {
      //     ...survey,
      //     responses: 1,
      //   };
      // });
      // const createdCampaignSurvey = new Campaignsurvey({
      //   campaignOwnerId: campaignId,
      //   campaignName,
      //   surveyTaken: updatedSurveyData,
      // });

      // try {
      //   createdCampaignSurvey.save((err) => {
      //     if (err) {
      //       console.log(err);
      //       res.json({
      //         success: false,
      //         data: err,
      //         message: "Creating Survey Failed",
      //       });
      //       return;
      //     } else {
      //       Voter.updateOne(
      //         { _id: voterId },
      //         {
      //           $push: {
      //             surveys: {
      //               campaignId,
      //               campaignName,
      //               surveyAnswers: voterAnswers,
      //             },
      //           },
      //         },
      //         (err) => {
      //           if (err) {
      //             res.json({
      //               success: false,
      //               message: "Something went wrong",
      //             });
      //           } else {
      //             res.json({
      //               message: "Campaign Survey Saved ",
      //               success: true,
      //             });
      //           }
      //         }
      //       );
      //     }
      //   });
      // } catch (err) {
      //   console.log(err);
      //   res.json({
      //     success: false,
      //     data: err,
      //     message: "Creating Survey Failed. Trying again latter",
      //   });
      // }
    }
  } else {
    res.json({ success: false, message: "You havn't Took any surveys" });
  }
};

const getCampaigns = async (req, res) => {
  const campaigns = await Survey.find({});

  if (campaigns) {
    res.json({
      success: true,
      campaigns: campaigns,
      message: "Campaigns Surveus Found",
    });
  } else {
    res.json({
      success: false,
      message: "Campaigns Surveys Not Found",
    });
  }
};

const getCampaignSurveys = async (req, res) => {
  const campaign = await Survey.findOne({
    campaignOwnerId: req.body.campaignId,
  });

  if (campaign) {
    res.json({
      success: true,
      campaignSurveys: campaign,
      message: "Campaigns Surveus Found",
    });
  } else {
    res.json({
      success: false,
      message: "Campaigns Surveys Not Found",
    });
  }
};

const getClientSurvey = async (req, res) => {
  const campaignsSurveys = await Survey.findOne({
    campaignOwnerId: req.body.id,
  });
  console.log(campaignsSurveys);

  if (campaignsSurveys) {
    res.json({
      success: true,
      clientData: campaignsSurveys,
      message: "Campaign Surveys Found",
    });
  } else {
    res.json({
      success: false,
      message: "Campaign Surveys Not Found",
    });
  }
};

module.exports = {
  addSurvey,
  connectSurveyToUser,
  getCampaigns,
  getClientSurvey,
  getCampaignSurveyResponses,
  getCampaignSurveys,
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
