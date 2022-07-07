const Campaign = require("../Models/Campaign");

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
  console.log(req.body);
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
  } = req.body;

  try {
    let ad = Campaign.updateOne(
      { _id: id },

      {
        $set: {
          campaignName,
          email,
          startDate,
          endDate,
          election,
          state,
          level,
          district,
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
            message: "Client Updated",
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

module.exports = {
  getClients,
  editClient,
  deleteClient,
};
