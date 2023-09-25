const Campaign = require("../Models/Campaign");
const Aristotle = require("../Models/Aristotledata");
const CampaignDataBucket = require("../Models/Campaigndatabucket");
const mongoose = require("mongoose");

const campaignLevelMappedValues = {
  "Federal - Senate": "STATE",
  "Federal - House": "CONG_DIST",
  "State - Statewide": "STATE",
  "State - Senate": "ST_UP_HOUS",
  "State - House": "ST_LO_HOUS",
  "County - County Wide": "CNTY_DIST",
  "County - County Commision": "CNTY_DIST",
  "City - City Wide": "MUNICIPALITY",
};

const getClients = async (req, res) => {
  const allClients = await Campaign.find({}, "-password");

  if (allClients) {
    res.json({
      success: true,
      message: "Found Clients",
      clients: allClients,
    });
  } else {
    res.json({
      success: false,
      message: "Found Not Clients",
    });
  }
};

const editClient = async (req, res) => {
  console.log(req.body, "i am body");
  const {
    campaignName,
    email,
    startDate,
    endDate,
    election,
    state,
    level,
    district,
    id,
    active,
    city,
    county,
    countyCommission,
    dataBucketUpdated,
  } = req.body;

  let resolvedCampaignData;

  if (dataBucketUpdated) {
    let buildQuery = (state, level) => {
      let query = {};

      if (level === "Federal - Senate" || level === "State - Statewide") {
        query = {
          STATE: state,
        };
      }

      if (level === "Federal - House") {
        query = {
          STATE: state,
          [campaignLevelMappedValues[level]]: { $in: district },
        };
      }

      if (level === "State - Senate" || level === "State - House") {
        query = {
          STATE: state,
          [campaignLevelMappedValues[level]]: { $in: district },
        };
      }

      if (
        level === "County - County Wide" ||
        level === "County - County Commision"
      ) {
        query = {
          STATE: state,
          [campaignLevelMappedValues[level]]: { $in: countyCommission },
        };
      }

      if (level === "City - City Wide") {
        query = {
          STATE: state,
          [campaignLevelMappedValues[level]]: { $in: city },
        };
      }

      return query;
    };

    let foundQuery = buildQuery(state, level);
    console.log(foundQuery, "i am final query");

    try {
      let campaignData = Aristotle.aggregate([
        {
          $match: foundQuery,
        },
      ]);

      resolvedCampaignData = await campaignData;

      // Process the resolvedCampaignData here if successful.
      // console.log("Aggregation result:", resolvedCampaignData);
    } catch (error) {
      // Handle the error here.
      console.error("Error during aggregation:", error);
      res.json({
        success: false,
        data: err,
        message: "Something went wrong , Code: #databucketresultsfailed",
      });
      return;
    }
    console.log(resolvedCampaignData.length, "i am resolved");
  }

  try {
    let ad = Campaign.updateOne(
      { _id: id },

      {
        $set: {
          campaignName,
          // email,
          startDate,
          endDate,
          election,
          state,
          level,
          district,
          active,
          city,
          county,
          countyCommission,
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
          if (dataBucketUpdated) {
            let objectId = mongoose.Types.ObjectId(id);
            console.log(objectId, "i am object id");
            console.log(resolvedCampaignData.length, "i am resolved");
            CampaignDataBucket.updateOne(
              { campaignId: mongoose.Types.ObjectId(id) },
              {
                $set: {
                  campaignData: resolvedCampaignData,
                },
              },
              (err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: "Something went wrong #databucketupdateerror",
                  });
                  return;
                } else {
                  console.log("=====> data bucket updated");
                  res.json({
                    success: true,
                    message: "Client Data Updated",
                  });
                  return;
                }
              }
            );
          } else {
            console.log("=====> data bucket updated outside");
            res.json({
              success: true,
              message: "Client Data Updated",
            });
            return;
          }
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

const deleteClient = async (req, res) => {
  console.log(req.body);

  try {
    ad = await Campaign.findByIdAndRemove({ _id: req.body.id });
    console.log(ad);
    ad = true;
    // console.log(res);
    console.log("done");
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Error deleting Client",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,

      message: "Client deleted",
    });
  } else {
    res.json({
      success: false,

      message: "Error deleting Client",
    });
    return;
  }
};

const getDistricts = async (req, res) => {
  console.log(req.body);

  const data = await Aristotle.distinct(req.body.field, {
    [req.body.fieldTwoName ? req.body.fieldTwoName : "STATE"]: req.body.state,
  });
  console.log(data);

  if (data) {
    res.json({ success: true, message: "Districts found", districts: data });
  } else {
    res.json({ success: false, message: "Districts not found" });
  }
};

module.exports = {
  getClients,
  editClient,
  deleteClient,
  getDistricts,
};
