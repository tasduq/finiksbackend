const Aristotle = require("../Models/Aristotledata");
const List = require("../Models/Phonebanklists");

// var SEX = "F";
// var PARTY_CODE = "I";
// var ETHNIC_INFER = "B";
// var ETHNICCODE = "WL";
// var RELIGION = "I";
// var LANGUAGE = "E1";
// var MRTLSTATUS = "S";
// var OCCUPATION = "B";
// var PRESENCHLD = "Y";
// var STATUS = "A";
// var VOT_PREF = "U";
// var CONG_DIST = 3;
// var ST_LO_HOUS = 20;
// var ST_UP_HOUS = 8;
// var ZIP = { gte: 32601, lte: 32604 };
// var PREC_NO1 = { gte: 28, lte: 59 };
// var STATE = "FL";
// var CITY = "Gainesville";
// var AI_COUNTY_NAME = "ALACHUA";
// var VTR = {
//   path: "VTR_PPP20",
//   query: "M",
// };
// var VP_GEN = { gte: 40, lte: 70 };
// var VP_PPP = { gte: 33, lte: 66 };
// var VP_PRI = { gte: 10, lte: 50 };
// var REGIS_DATE = { gte: 19870205, lte: 20080523 };
// var AGE = { gte: 19, lte: 60 };

// const managePipeline = (filters) => {
//   const pipeLine = [
//     {
//       $search: {
//         compound: {
//           filter: [
//             filters.SEX && {
//               text: {
//                 query: filters.SEX,
//                 path: "SEX",
//               },
//             },
//             filters.ETHNIC_INFER && {
//               text: {
//                 query: ETHNIC_INFER,
//                 path: "ETHNIC_INFER",
//               },
//             },
//             filters.ETHNICCODE && {
//               text: {
//                 query: filters.ETHNICCODE,
//                 path: "ETHNICCODE",
//               },
//             },
//             filters.RELIGION && {
//               text: {
//                 query: filters.RELIGION,
//                 path: "RELIGION",
//               },
//             },

//             filters.LANGUAGE && {
//               text: {
//                 query: filters.LANGUAGE,
//                 path: "LANGUAGE",
//               },
//             },
//             filters.MRTLSTATUS && {
//               text: {
//                 query: filters.MRTLSTATUS,
//                 path: "MRTLSTATUS",
//               },
//             },
//             filters.OCCUPATION && {
//               text: {
//                 query: filters.OCCUPATION,
//                 path: "OCCUPATION",
//               },
//             },
//             filters.PRESENCHLD && {
//               text: {
//                 query: filters.PRESENCHLD,
//                 path: "PRESENCHLD",
//               },
//             },
//             filters.STATUS && {
//               text: {
//                 query: filters.STATUS,
//                 path: "STATUS",
//               },
//             },
//             filters.VOT_PREF && {
//               text: {
//                 query: filters.VOT_PREF,
//                 path: "VOT_PREF",
//               },
//             },
//             filters.ZIP && {
//               range: {
//                 path: "ZIP",
//                 gte: filters.ZIP.from, // From
//                 lte: filters.ZIP.to, // TO
//               },
//             },
//             filters.PREC_NO1 && {
//               range: {
//                 path: "PREC_NO1",
//                 gte: filters.PREC_NO1.from, // From
//                 lte: filters.PREC_NO1.to, // TO
//               },
//             },
//             filters.CONG_DIST && {
//               range: {
//                 path: "CONG_DIST",
//                 gte: filters.CONG_DIST, // From
//                 // lte: 32604, // TO
//               },
//             },
//             filters.ST_UP_HOUS && {
//               range: {
//                 path: "ST_UP_HOUS",
//                 gte: filters.ST_UP_HOUS, // From
//                 // lte: 32604, // TO
//               },
//             },
//             filters.ST_LO_HOUS && {
//               range: {
//                 path: "ST_LO_HOUS",
//                 gte: filters.ST_LO_HOUS, // From
//                 // lte: 32604, // TO
//               },
//             },

//             filters.VTR && {
//               text: {
//                 query: filters.VTR.query,
//                 path: filters.VTR.path,
//               },
//             },
//             filters.VP_GEN && {
//               range: {
//                 path: "VP_GEN",
//                 gte: filters.VP_GEN.from, // From
//                 lte: filters.VP_GEN.to, // TO
//               },
//             },
//             filters.VP_PPP && {
//               range: {
//                 path: "VP_PPP",
//                 gte: filters.VP_PPP.from, // From
//                 lte: filters.VP_PPP.to, // TO
//               },
//             },
//             filters.VP_PRI && {
//               range: {
//                 path: "VP_PRI",
//                 gte: filters.VP_PRI.from, // From
//                 lte: filters.VP_PRI.to, // TO
//               },
//             },
//             filters.REGIS_DATE && {
//               range: {
//                 path: "REGIS_DATE",
//                 gte: filters.REGIS_DATE.from, // From
//                 lte: filters.REGIS_DATE.to, // TO
//               },
//             },
//             filters.AGE && {
//               range: {
//                 path: "AGE",
//                 gte: filters.AGE.from, // From
//                 lte: filters.AGE.to, // TO
//               },
//             },
//           ],
//           must: [
//             filters.STATE && {
//               text: {
//                 query: filters.STATE,
//                 path: "STATE",
//               },
//             },
//             filters.CITY && {
//               text: {
//                 query: filters.CITY,
//                 path: "CITY",
//               },
//             },
//             filters.AI_COUNTY_NAME && {
//               text: {
//                 query: filters.AI_COUNTY_NAME,
//                 path: "AI_COUNTY_NAME",
//               },
//             },
//             filters.PARTY_CODE && {
//               text: {
//                 query: filters.PARTY_CODE,
//                 path: "PARTY_CODE",
//               },
//             },
//           ],
//         },
//       },
//     },
//   ];

//   return pipeLine;
// };

const queryPhonebank = async (req, res) => {
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

const saveList = async (req, res, next) => {
  console.log(req.body);
  const { listName, campaignOwnerId, voters } = req.body;

  const createdList = new List({
    listName,
    totalNumbers: voters.length,
    campaignOwnerId,
    voters,
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
      message: "Creating List Faile. Trying again latter",
    });
  }
};

const getLists = async (req, res) => {
  const { campaignId } = req.body;
  console.log(req.body);

  const phonebankLists = await List.find(
    { campaignOwnerId: campaignId },
    "-voters"
  );

  let reverse = phonebankLists.map((item) => item).reverse();

  if (phonebankLists) {
    res.json({
      success: true,
      phonebankLists: reverse,
      message: "Lists Found for phonebanking",
    });
  } else {
    res.json({
      success: false,
      message: "Lists Not Found for phonebanking",
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

module.exports = {
  queryPhonebank,
  saveList,
  getLists,
  updateList,
  deleteList,
  editList,
};
