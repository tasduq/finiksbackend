const Aristotle = require("../Models/Aristotledata");
const Finiks = require("../Models/Finiksdata");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");

const getAristotleDataTotalCount = async (req, res) => {
  try {
    let count = 0;
    count = await Aristotle.countDocuments();
    console.log("Number of documents in the collection:", count);
    res.json({
      success: true,
      aristotleDataTotal: count,
      message: "Aristotle Data found",
    });
    return;
  } catch (err) {
    console.error("Error counting documents:", err);
    res.json({
      success: false,
      message: "Something went wrong , #aristotlecountfailed",
    });
    return;
  }
};

const getAristotledata = async (req, res) => {
  const { bottomHit } = req.body;
  console.log(bottomHit);
  const data = await Aristotle.find({})
    .sort({ _id: 1 })
    .skip(bottomHit > 0 ? (bottomHit - 1) * 100 : 0)
    .limit(10);

  if (data) {
    console.log("data found", data.length);
    res.json({
      success: true,
      aristotleData: data,
      message: "Aristotle Data found",
    });
    return;
  } else {
    res.json({
      success: false,
      message: "Aristotle Data Not found",
    });
    return;
  }
};

// columnToKey: {
//   A: "API_ID",
//   B: "FIRSTNAME",
//   C: "MIDDLE_INI",
//   D: "LASTNAME",
//   E: "SEX",
//   F: "AGE",
//   G: "PARTY_CODE",
//   H: "REGIS_DATE",
//   I: "ABSENTEE",
//   J: "STATUS",
//   K: "ETHNIC_COD",
//   L: "ETHNICCODE",
//   M: "ETHNIC_INFER",
//   N: "ETHNICGRP",
//   O: "VOTER_ID",
//   P: "LANGUAGE",
//   Q: "MRTLSTATUS",
//   R: "OCCUPATION",
//   S: "PRESENCHLD",
//   T: "RELIGION",
//   U: "MOBILE_NUM",
//   V: "PHONE_NUM",
//   W: "EMAIL",
//   X: "EMAIL2",
//   Y: "EMAIL3",
//   Z: "STATECONT",
//   AA: "ST_UP_HOUS",
//   AB: "ST_LO_HOUS",
//   AC: "CONG_DIST",
//   AD: "AI_COUNTY_NAME",
//   AE: "CITY_DIST",
//   AF: "CNTY_DIST",
//   AG: "CWARD_PREC",
//   AH: "EDUC_DIST",
//   AI: "DMA_NAME",
//   AJ: "MUNICIPALITY",
//   AK: "PREC_NO1",
//   AL: "PREC_PART",
//   AM: "SCHL_BRD",
//   AN: "ADDRESS",
//   AO: "CITY",
//   AP: "STATE",
//   AQ: "ZIP",
//   AR: "MADDRESS",
//   AS: "MCITY",
//   AT: "MSTATE",
//   AU: "MZIP",
//   AV: "LATITUDE",
//   AW: "LONGITUDE",
//   AX: "HOME_SEQ",
//   AY: "VOT_PREF",
//   AZ: "VP_GEN",
//   BA: "VP_OTH",
//   BB: "VP_PPP",
//   BC: "VP_PRI",
//   BD: "VTR_PPP12",
//   BE: "VTR_PPP16",
//   BF: "VTR_PPP20",
//   BG: "VTR_GEN12",
//   BH: "VTR_GEN16",
//   BI: "VTR_GEN20",
//   BJ: "PRFL_2NDAMEND",
//   BK: "PRFL_ACTIVE_MIL",
//   BL: "PRFL_AMZN_PRIME",
//   BM: "PRFL_ANML_RIGHTS",
//   BN: "PRFL_BIDEN_SUPPORT",
//   BO: "PRFL_BLM_SUPPORT",
//   BP: "PRFL_BORDER_SECURITY",
//   BQ: "PRFL_CHOICELIFE",
//   BR: "PRFL_CLINTON_SUPPORT",
//   BS: "PRFL_CONSERVATIVE_NEWS",
//   BT: "PRFL_EDUCATION",
//   BU: "PRFL_ENVIRONMENT",
//   BV: "PRFL_EVANGELICAL",
//   BW: "PRFL_FENCE_SITTER",
//   BX: "PRFL_GUN_CONTROL",
//   BY: "PRFL_HEALTHCARE_REFORM",
//   BZ: "PRFL_HEALTHCARE",
//   CA: "PRFL_IMMIGRATION_REFORM",
//   CB: "PRFL_INFLUENCER",
//   CC: "PRFL_INSURANCE",
//   CD: "PRFL_LABOR",
//   CE: "PRFL_LGBT_SUPPORT",
//   CF: "PRFL_LIBERAL_NEWS",
//   CG: "PRFL_MARIJUANA_REFORM",
//   CH: "PRFL_MARRIAGE_EQUALITY",
//   CI: "PRFL_METOO_SUPPORT",
//   CJ: "PRFL_MIL_SUPPORT",
//   CK: "PRFL_MINWAGE",
//   CL: "PRFL_OBAMA",
//   CM: "PRFL_PERSUADABLE_VOTER",
//   CN: "PRFL_POLITICAL_IDEOLOGY",
//   CO: "PRFL_SANDERS_SUPPORT",
//   CP: "PRFL_TAXES",
//   CQ: "PRFL_TEACHERS_UNION",
//   CR: "PRFL_TEAPARTY",
//   CS: "PRFL_TRUMP_SUPPORT",
//   CT: "PRFL_VETERAN",
// },

const addAristotleData = async (req, res) => {
  //   const { fileData } = req.body;
  //   const { voters } = req.body;

  console.log(req.file);
  const result = excelToJson({
    source: req.file.buffer, // fs.readFileSync return a Buffer
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });

  console.log(result, "i am result");

  if (!result.sheet1 && !result.Sheet1) {
    console.log("Convert Sheet name to sheet1 or Sheet1");
    res.json({
      succes: false,
      message: "Convert Sheet name to sheet1 or Sheet1",
    });
    return;
  }
  let saveVoter = [];
  if (result.sheet1) {
    saveVoter = [...result.sheet1];
  } else {
    saveVoter = [...result.Sheet1];
  }
  saveVoter.splice(0, 1);
  // console.log(saveVoter);
  // filter = { 'API_ID'}

  saveVoter.map(async (voter) => {
    Aristotle.collection.updateOne(
      { API_ID: voter.API_ID },
      { $set: { ...voter } },
      { upsert: true },
      async function (err, docs) {
        if (err) {
          console.log(err);
          res.json({ success: false, message: "Error in saving Data" });
          return;
        } else {
          console.log("Multiple documents inserted to Aristotle Collection");
          await Finiks.collection.updateOne(
            { API_ID: voter.API_ID },
            { $set: { ...voter } },
            { upsert: true }
            // (err, docs) => {
            //   if (err) {
            //     console.log(err, "i am error");
            //     res.json({ success: false, message: "Error in saving Data" });
            //     return;
            //   } else {
            //     return res.json({
            //       success: true,
            //       message: "Aristotle Data and Finiks Data Saved",
            //     });
            //   }
            // }
          );

          if (!res.headersSent) {
            res.json({
              success: true,
              message: "Aristotle Data and Finiks Data Saved",
            });
            return;
          }
        }
      }
    );
  });
};

const editVoter = async (req, res) => {
  const { voterId } = req.body;
  console.log(voterId);

  //   const voter = await Aristotle.findOne({ _id: voterId });
  //   console.log(voter);
  //   if (voter) {
  // let newData = { ...voter._doc, tag: "New Tag" };
  // console.log(newData);

  Aristotle.updateOne(
    { _id: voterId },
    {
      $set: { tag: "New tag" },
    }
  )
    .then((response) => {
      console.log(response);
      res.json({ success: true, message: "Voter Updated" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "Voter  Updating Error" });
    });
  //   } else {
  //     res.json({ success: false, message: "Not Found" });
  //   }
};

module.exports = {
  getAristotledata,
  addAristotleData,
  editVoter,
  getAristotleDataTotalCount,
};
