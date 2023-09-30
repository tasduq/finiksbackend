const Aristotle = require("../Models/Aristotledata");
const List = require("../Models/List");

const queryData = async (req, res) => {
  console.log(req.body, "i am filters");
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

            filters.PREC_NO1
              ? typeof filters.PREC_NO1.from === "number"
                ? {
                    range: {
                      path: "PREC_NO1",
                      gte: filters.PREC_NO1.from, // From
                      lte: filters.PREC_NO1.from, // TO
                    },
                  }
                : {
                    text: {
                      query: filters.PREC_NO1.from,
                      path: "PREC_NO1",
                    },
                  }
              : undefined,
            filters.CONG_DIST && {
              range: {
                path: "CONG_DIST",
                gte: filters.CONG_DIST.from, // From
                lte: filters.CONG_DIST.to, // TO
              },
            },
            filters.ST_UP_HOUS && {
              range: {
                path: "ST_UP_HOUS",
                gte: filters.ST_UP_HOUS.from, // From
                lte: filters.ST_UP_HOUS.to, // Exact match on "from" value
              },
            },

            filters.ST_LO_HOUS && {
              range: {
                path: "ST_LO_HOUS",
                gte: filters.ST_LO_HOUS.from, // From
                lte: filters.ST_LO_HOUS.to, // TO
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
          must: [
            filters.STATE && {
              text: {
                query: filters.STATE,
                path: "STATE",
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
  console.log(JSON.stringify(pipeLine));

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
  // console.log(req.body);
  const { listName, campaignOwnerId, voters } = req.body;
  console.log(listName);

  let newVoters = voters?.map((voter) => {
    return {
      ...voter,
      voterTags: [],
    };
  });
  // console.log(newVoters);

  const createdList = new List({
    listName,
    totalNumbers: voters.length,
    campaignOwnerId,
    voters: newVoters,
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

  const lists = await List.find({ campaignOwnerId: campaignId }, "-voters");

  let reverse = lists.map((item) => item).reverse();
  console.log(reverse, "yooo");

  if (lists) {
    res.json({
      success: true,
      lists: reverse,
      message: "Lists Found for Canvassing",
    });
  } else {
    res.json({
      success: false,
      message: "Lists Not Found for Canvassing",
    });
  }
};

module.exports = {
  queryData,
  saveList,
  getLists,
};
