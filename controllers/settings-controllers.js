const e = require("express");
const Managestate = require("../Models/Managestate");

const getStates = async (req, res) => {
  try {
    let foundStates = await Managestate.find({});
    if (foundStates?.length > 0) {
      res.json({
        success: true,
        message: "States found",
        foundStates,
      });
      return;
    } else {
      res.json({
        success: false,
        message: "No State Found. Please add State before adding the campaign",
      });
      return;
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Something went wrong #gettingstates",
    });
    return;
  }
};

const addState = async (req, res) => {
  const { stateName, stateKey } = req.body;

  let stateKeyFound = await Managestate.findOne({ stateKey: stateKey });
  console.log(stateKeyFound, "i am found");
  if (stateKeyFound) {
    res.json({
      success: false,
      message: "State key already Exist",
    });
    return;
  }

  if (stateName && stateKey) {
    const saveNewState = new Managestate({
      stateKey,
      stateName,
    });
    saveNewState.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Something went wrong",
        });
        return;
      } else {
        res.json({
          message: "New State Added Successfully",
          success: true,
        });
        return;
      }
    });
  } else {
    res.json({
      success: false,
      message: "Please Fill all the fields",
    });
    return;
  }
};

module.exports = {
  getStates,
  addState,
};
