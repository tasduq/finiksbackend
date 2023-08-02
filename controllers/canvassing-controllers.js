const Aristotle = require("../Models/Aristotledata");
const FiniksData = require("../Models/Finiksdata");
const List = require("../Models/Canvassinglist");
const List2 = require("../Models/List");
const Campaign = require("../Models/Campaign");
const Team = require("../Models/Teammember");
const Canvassedvotersbycampaign = require("../Models/Canvassedvotersbycampaigns");

const queryCanvassing = async (req, res) => {
  console.log(req.body);
  // let pipeline = await managePipeline(req.body);
  // console.log(pipeline[0].$search.compound);
  const filters = req.body;
  let pipeLine = [
    {
      $search: {
        compound: {
          filter: [
            filters.SEX && {
              text: {
                query: filters.SEX,
                path: "SEX",
              },
            },
            filters.ETHNIC_INFER && {
              text: {
                query: filters.ETHNIC_INFER,
                path: "ETHNIC_INFER",
              },
            },
            filters.ETHNICCODE && {
              text: {
                query: filters.ETHNICCODE,
                path: "ETHNICCODE",
              },
            },
            filters.RELIGION && {
              text: {
                query: filters.RELIGION,
                path: "RELIGION",
              },
            },
            filters.LANGUAGE && {
              text: {
                query: filters.LANGUAGE,
                path: "LANGUAGE",
              },
            },
            filters.MRTLSTATUS && {
              text: {
                query: filters.MRTLSTATUS,
                path: "MRTLSTATUS",
              },
            },
            filters.OCCUPATION && {
              text: {
                query: filters.OCCUPATION,
                path: "OCCUPATION",
              },
            },
            filters.PRESENCHLD && {
              text: {
                query: filters.PRESENCHLD,
                path: "PRESENCHLD",
              },
            },
            filters.STATUS && {
              text: {
                query: filters.STATUS,
                path: "STATUS",
              },
            },
            filters.VOT_PREF && {
              text: {
                query: filters.VOT_PREF,
                path: "VOT_PREF",
              },
            },
            filters.ZIP && {
              range: {
                path: "ZIP",
                gte: filters.ZIP.from, // From
                lte: filters.ZIP.to, // TO
              },
            },
            filters.PREC_NO1 && {
              range: {
                path: "PREC_NO1",
                gte: filters.PREC_NO1.from, // From
                lte: filters.PREC_NO1.to, // TO
              },
            },
            filters.CONG_DIST && {
              range: {
                path: "CONG_DIST",
                gte: filters.CONG_DIST, // From
                // lte: 32604, // TO
              },
            },
            filters.ST_UP_HOUS && {
              range: {
                path: "ST_UP_HOUS",
                gte: filters.ST_UP_HOUS, // From
                // lte: 32604, // TO
              },
            },
            filters.ST_LO_HOUS && {
              range: {
                path: "ST_LO_HOUS",
                gte: filters.ST_LO_HOUS, // From
                // lte: 32604, // TO
              },
            },

            filters.VTR && {
              text: {
                query: filters.VTR.query,
                path: filters.VTR.path,
              },
            },
            filters.VP_GEN && {
              range: {
                path: "VP_GEN",
                gte: filters.VP_GEN.from, // From
                lte: filters.VP_GEN.to, // TO
              },
            },
            filters.VP_PPP && {
              range: {
                path: "VP_PPP",
                gte: filters.VP_PPP.from, // From
                lte: filters.VP_PPP.to, // TO
              },
            },
            filters.VP_PRI && {
              range: {
                path: "VP_PRI",
                gte: filters.VP_PRI.from, // From
                lte: filters.VP_PRI.to, // TO
              },
            },
            filters.REGIS_DATE && {
              range: {
                path: "REGIS_DATE",
                gte: filters.REGIS_DATE.from, // From
                lte: filters.REGIS_DATE.to, // TO
              },
            },
            filters.AGE && {
              range: {
                path: "AGE",
                gte: filters.AGE.from, // From
                lte: filters.AGE.to, // TO
              },
            },
            filters.PARTY_CODE && {
              text: {
                query: filters.PARTY_CODE,
                path: "PARTY_CODE",
              },
            },
          ],
          must: [
            filters.STATE && {
              text: {
                query: filters.STATE,
                path: "STATE",
              },
            },
            filters.CITY && {
              text: {
                query: filters.CITY,
                path: "CITY",
              },
            },
            filters.AI_COUNTY_NAME && {
              text: {
                query: filters.AI_COUNTY_NAME,
                path: "AI_COUNTY_NAME",
              },
            },
          ],
        },
      },
    },
  ];
  const yoo = pipeLine[0].$search.compound.filter.filter((subFilter) => {
    // console.log(subFilter);
    return subFilter !== undefined;
  });
  console.log(yoo);

  pipeLine[0].$search.compound.filter = yoo;
  console.log(pipeLine);

  const results = Aristotle.collection.aggregate(pipeLine);
  let count = 0;

  let voters = [];

  await results.forEach((voter) => {
    // console.log(voter);
    // if(voter.CITY === 'Gainesville' && voter.STATE === 'FL' && voter.AI_COUNTY_NAME === )
    // console.log("RUN");
    // count++;
    // console.log(count);
    voters.push(voter);
  });
  // console.log(voters.length, "i am voters");
  if (voters.length >= 1) {
    res.json({ success: true, message: "Voters Found", foundVoters: voters });
  } else {
    res.json({
      success: false,
      message: "Voters Not Found According to the Filters",
    });
  }
};

const saveRecord = async (req, res, next) => {
  console.log(req.body, "hello i am body");
  const {
    recordName,
    campaignOwnerId,
    selectedList,
    selectedScript,
    walkbooks,
  } = req.body;

  let listTotalNumbers = await List2.findOne(
    { _id: selectedList },
    "totalNumbers"
  );
  console.log(listTotalNumbers);

  const createdList = new List({
    recordName,
    totalNumbers: listTotalNumbers?.totalNumbers,
    campaignOwnerId,
    list: selectedList,
    scriptName: selectedScript.scriptName,
    scriptId: selectedScript._id,
    created: new Date(),
    walkBooks: walkbooks,
  });

  try {
    createdList.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating Record Failed",
        });
        return;
      } else {
        res.json({
          message: "Record Saved ",
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Creating Record Faile. Trying again latter",
    });
  }
};

const getRecords = async (req, res) => {
  const { campaignId } = req.body;
  console.log(req.body);

  const phonebankLists = await List.find({ campaignOwnerId: campaignId });

  let reverse = phonebankLists.map((item) => item).reverse();

  if (phonebankLists) {
    res.json({
      success: true,
      canvassingLists: reverse,
      message: "Records Found for Canvassing",
    });
  } else {
    res.json({
      success: false,
      message: "Records Not Found for Canvassing",
    });
  }
};

const updateRecord = async (req, res) => {
  console.log(req.body, "i am body");
  const {
    recordName,
    campaignOwnerId,
    selectedList,
    selectedScript,
    recordId,
    active,
    walkbooks,
  } = req.body;

  let listTotalNumbers = await List2.findOne(
    { _id: selectedList },
    "totalNumbers"
  );
  console.log(listTotalNumbers, "i am totalNumbers");

  if (recordId) {
    try {
      // ad = await Ad.findOne({ _id: id });

      let ad = List.updateOne(
        { _id: recordId },

        {
          $set: {
            recordName,
            campaignOwnerId,
            totalNumbers: listTotalNumbers?.totalNumbers,
            list: selectedList,
            scriptName: selectedScript.scriptName,
            scriptId: selectedScript._id,
            active,
            walkBooks: walkbooks,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Record Updated",
            });
            return;
          }
        }
      );

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  } else {
    res.json({
      success: false,
      message: "Record Id not found",
    });
    return;
  }
};

const saveList = async (req, res, next) => {
  // console.log(req.body);
  const { listName, campaignOwnerId, voters } = req.body;
  console.log(listName);

  const createdList = new List({
    listName,
    totalNumbers: voters.length,
    campaignOwnerId,
    voters,
    active: "Active",
  });

  try {
    createdList.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating List Failed",
        });
        return;
      } else {
        res.json({
          message: "List Saved ",
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Creating List Failed. Trying again latter",
    });
  }
};

const getLists = async (req, res) => {
  const { campaignId } = req.body;
  console.log(req.body);

  const CanvassingLists = await List.find(
    { campaignOwnerId: campaignId },
    "-voters"
  );

  let reverse = CanvassingLists.map((item) => item).reverse();
  console.log(reverse, "yooo");

  if (CanvassingLists) {
    res.json({
      success: true,
      canvassingLists: reverse,
      message: "Lists Found for Canvassing",
    });
  } else {
    res.json({
      success: false,
      message: "Lists Not Found for Canvassing",
    });
  }
};

const getListsForCanvassing = async (req, res) => {
  const { campaignId } = req.body;
  console.log(req.body);

  const CanvassingLists = await List.find({ campaignOwnerId: campaignId });

  let reverse = CanvassingLists.map((item) => item).reverse();
  console.log(reverse, "yooo");

  if (CanvassingLists) {
    res.json({
      success: true,
      canvassingLists: reverse,
      message: "Lists Found for Canvassing",
    });
  } else {
    res.json({
      success: false,
      message: "Lists Not Found for Canvassing",
    });
  }
};

const updateList = async (req, res) => {
  console.log(req.body);
  const { selectedList, selectedScript } = req.body;

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = List.updateOne(
      { _id: selectedList },

      {
        $set: {
          scriptName: selectedScript.scriptName,
          scriptId: selectedScript._id,
        },
      },
      function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "List Updated",
          });
          return;
        }
      }
    );

    console.log("done");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const editList = async (req, res) => {
  console.log(req.body);
  const { selectedList, selectedScript, active } = req.body;

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = List.updateOne(
      { _id: selectedList },

      {
        $set: {
          scriptName: selectedScript.scriptName,
          scriptId: selectedScript._id,
          active,
        },
      },
      function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "List Updated",
          });
          return;
        }
      }
    );

    console.log("done");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const deleteList = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    ad = await List.findByIdAndRemove({ _id: id });
    // console.log(ad);
    ad = true;
    // console.log(res);
    console.log("done");
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Error deleting List",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,

      message: "List deleted",
    });
  } else {
    res.json({
      success: false,
      message: "Error deleting List",
    });
    return;
  }
};

const searchVoter = async (req, res) => {
  console.log(req.body, "i am searchvoter");
  const filters = req.body?.filters;
  // const fullName = new RegExp(`.*${name.split(" ").join(".*")}.*`, "i");
  // console.log("i am fullname", fullName);

  try {
    let foundVoters = [];

    let pipeLineFunc = (searchFormat) => {
      console.log(searchFormat, "=====> Search Format");
      let pipeLine;
      if (searchFormat === "FULLNAME") {
        let [firstName, lastName] = filters.FIRSTNAME.split(" ");
        console.log(firstName, lastName, "i am fullname ====>");

        pipeLine = [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $regexMatch: {
                      input: "$FIRSTNAME",
                      regex: new RegExp(firstName, "i"),
                    },
                  },
                  {
                    $regexMatch: {
                      input: "$LASTNAME",
                      regex: new RegExp(lastName, "i"),
                    },
                  },
                  filters.ADDRESS && {
                    $cond: {
                      if: filters.ADDRESS,
                      then: {
                        $regexMatch: {
                          input: "$ADDRESS",
                          regex: new RegExp(filters.ADDRESS, "i"),
                        },
                      },
                      else: true,
                    },
                  },
                  filters.STATE && {
                    $cond: {
                      if: filters.STATE,
                      then: {
                        $regexMatch: {
                          input: "$STATE",
                          regex: new RegExp(filters.STATE, "i"),
                        },
                      },
                      else: true,
                    },
                  },
                  filters.CITY && {
                    $cond: {
                      if: filters.CITY,
                      then: {
                        $regexMatch: {
                          input: "$CITY",
                          regex: new RegExp(filters.CITY, "i"),
                        },
                      },
                      else: true,
                    },
                  },
                  filters.AI_COUNTY_NAME && {
                    $cond: {
                      if: filters.AI_COUNTY_NAME,
                      then: {
                        $regexMatch: {
                          input: "$AI_COUNTY_NAME",
                          regex: new RegExp(filters.AI_COUNTY_NAME, "i"),
                        },
                      },
                      else: true,
                    },
                  },
                ],
              },
            },
          },
        ];
        console.log(pipeLine[0], "i am pure pipeline");

        const yoo = pipeLine[0].$match.$expr.$and.filter((subFilter) => {
          // console.log(subFilter);
          return subFilter !== undefined;
        });
        console.log(yoo);

        pipeLine[0].$match.$expr.$and = yoo;
        console.log(pipeLine[0].$match.$expr.$and, "i am pipe");
      } else {
        pipeLine = [
          {
            $search: {
              compound: {
                filter: [
                  filters.FIRSTNAME && {
                    text: {
                      query: filters.FIRSTNAME,
                      path: searchFormat,
                    },
                  },
                  filters.STATE && {
                    text: {
                      query: filters.STATE,
                      path: "STATE",
                    },
                  },
                  filters.CITY && {
                    text: {
                      query: filters.CITY,
                      path: "CITY",
                    },
                  },
                  filters.AI_COUNTY_NAME && {
                    text: {
                      query: filters.AI_COUNTY_NAME,
                      path: "AI_COUNTY_NAME",
                    },
                  },
                  filters.ADDRESS && {
                    text: {
                      query: filters.ADDRESS,
                      path: "ADDRESS",
                    },
                  },
                ],
                must: filters.ADDRESS && [
                  {
                    text: {
                      query: filters.ADDRESS,
                      path: "ADDRESS",
                      // fuzzy: {
                      //   maxEdits: 0,
                      // },
                    },
                  },
                ],
              },
            },
          },
        ];
        console.log(pipeLine[0], "i am pure pipeline");
        const yoo = pipeLine[0].$search.compound.filter.filter((subFilter) => {
          // console.log(subFilter);
          return subFilter !== undefined;
        });
        console.log(yoo);
        pipeLine[0].$search.compound.filter = yoo;
        console.log(pipeLine[0].$search.compound.filter, "i am pipe");
      }

      return pipeLine;
    };

    let voters = [];

    const [firstName, lastName] = filters?.FIRSTNAME?.split(" ");

    if (firstName && lastName) {
      // console.log(pipeLineFunc("FULLNAME"), "i am pipeline of fullname");
      let results = Aristotle.collection.aggregate(pipeLineFunc("FULLNAME"));

      await results.forEach((voter) => {
        voters.push(voter);
      });

      foundVoters = voters;
      console.log(foundVoters, "foundvoters results");
    } else {
      const results = Aristotle.collection.aggregate(pipeLineFunc("FIRSTNAME"));
      console.log(results, "i am results");

      await results.forEach((voter) => {
        voters.push(voter);
      });

      foundVoters = voters;
      console.log(foundVoters, "foundvoters results");

      if (foundVoters?.length === 0) {
        const results = Aristotle.collection.aggregate(
          pipeLineFunc("LASTNAME")
        );
        console.log(results, "i am results");

        await results.forEach((voter) => {
          voters.push(voter);
        });

        foundVoters = voters;
        console.log(foundVoters, "foundvoters results");
      }
    }

    let foundCampaign = await Canvassedvotersbycampaign.findOne({
      campaignOwnerId: req.body.campaignId,
    });
    console.log(foundCampaign, "i am surveyedcampaign");
    let filteredVoters;
    if (foundCampaign && foundCampaign?.surveyedVotersList?.length > 0) {
      console.log(foundCampaign, "i am foundcanvassed");
      filteredVoters = foundVoters?.filter((voter) => {
        let alreadyCanvassed = foundCampaign?.surveyedVotersList?.find(
          (surveyedVoter) => {
            return (
              surveyedVoter?.voterId.toString() === voter?._id?.toString() &&
              surveyedVoter?.surveyedBy === req.body.teamMemberId
            );
          }
        );
        console.log(alreadyCanvassed, "alreadyCanvassed");
        if (alreadyCanvassed === undefined) {
          return voter;
        }
      });
    }
    // console.log(foundVoters, "i am updatedfoundvoters");

    //Code to use if adam dont like pipeline method
    // if (searchType === "byName") {
    // foundVoters = await FiniksData.find({
    //   $or: [
    //     { FIRSTNAME: { $regex: fullName } },
    //     { LASTNAME: { $regex: fullName } },
    //   ],
    // });
    // }

    // if (searchType === "byLocation") {
    //   // foundVoters = await FiniksData.find({
    //   //   $or: [
    //   //     {
    //   //       CITY: { $regex: fullName },
    //   //       ADDRESS: { $regex: fullName },
    //   //       MUNICIPALITY: { $regex: fullName },
    //   //       AI_COUNTY_NAME: { $regex: fullName },
    //   //     },
    //   //   ],
    //   // });
    // }

    //bylist

    // if(searchType ==='byLocation'){
    //   foundVoters = await FiniksData.find({
    //     $or: [
    //       { FIRSTNAME: { $regex: fullName } },
    //     ],
    //   });
    // }

    // console.log(foundVoters, "i am foundvotrs");
    res.json({
      success: true,
      foundVoters:
        foundCampaign && foundCampaign?.surveyedVotersList?.length > 0
          ? filteredVoters
          : foundVoters,
    });
  } catch (err) {
    console.log(err, "i am error");
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const searchCanvassingList = async (req, res) => {
  console.log(req.body, "i am body");

  const { listName, campaignId } = req.body;
  const fullName = new RegExp(`.*${listName.split(" ").join(".*")}.*`, "i");
  console.log("i am fullname", fullName);
  let foundList = [];
  if (listName && campaignId) {
    try {
      foundList = await List.find({
        $and: [
          { recordName: { $regex: fullName } },
          { campaignOwnerId: campaignId },
        ],
      });
      console.log(foundList, "i am found list");
      res.json({
        success: true,
        message: "Lists Found",
        foundLists: foundList,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Something went wrong. Some data is missing",
    });
  }
};

module.exports = {
  queryCanvassing,
  saveList,
  getLists,
  updateList,
  deleteList,
  editList,
  getListsForCanvassing,
  saveRecord,
  getRecords,
  updateRecord,
  searchVoter,
  searchCanvassingList,
};
