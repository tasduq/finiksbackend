const Script = require("../Models/Script");

const createScript = async (req, res) => {
  console.log(req.body);

  const { status, scriptName, script, description, campaignOwnerId } = req.body;
  const createdScript = new Script({
    status,
    scriptName,
    script,
    description,
    campaignOwnerId,
  });

  try {
    createdScript.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating Script Failed",
        });
        return;
      } else {
        res.json({
          message: "Script Saved ",
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Creating Script Failed. Trying again latter",
    });
  }
};

const getScripts = async (req, res) => {
  const { campaignId } = req.body;
  console.log(req.body);

  const scripts = await Script.find({ campaignOwnerId: campaignId }, "-voters");

  let reverse = scripts.map((item) => item).reverse();

  if (scripts) {
    res.json({
      success: true,
      scripts: reverse,
      message: "Scripts Found for phonebanking",
    });
  } else {
    res.json({
      success: false,
      message: "Scripts Not Found for phonebanking",
    });
  }
};

const deleteScripts = async (req, res) => {
  console.log(req.body);

  try {
    ad = await Script.findByIdAndRemove({ _id: req.body.id });
    console.log(ad);
    ad = true;
    // console.log(res);
    console.log("done");
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Error deleting Script",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,

      message: "Script deleted",
    });
  } else {
    res.json({
      success: false,

      message: "Error deleting Script",
    });
    return;
  }
};

const editScripts = async (req, res) => {
  console.log(req.body);
  const { status, scriptName, script, description, campaignOwnerId, id } =
    req.body;

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = Script.updateOne(
      { _id: id },

      {
        $set: { status, scriptName, script, description },
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
            message: "Script Updated",
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

module.exports = {
  createScript,
  getScripts,
  deleteScripts,
  editScripts,
};
