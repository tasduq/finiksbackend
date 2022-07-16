const Campaign = require("../Models/Campaign");
const Team = require("../Models/Teammember");
const bcrypt = require("bcryptjs");
var otpGenerator = require("otp-generator");
var sendEmail = require("../Utils/Sendemail");

const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const {
    campaignName,
    email,
    password,
    startDate,
    endDate,
    election,
    state,
    level,
    district,
    role,
    county,
    countyCommission,
    city,
  } = req.body;
  console.log(req.body);

  if (campaignName && email && password) {
    let existingCampaign;
    try {
      existingCampaign = await Campaign.findOne({ email: email });

      if (existingCampaign) {
        console.log("Campaign already exists");
        res.json({ message: "Campaign Email Already Exists", success: false });
        return;
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log(err);
      console.log(
        "Signing up failed as hashing failed, please try again later."
      );

      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
      return;
    }

    let campaignCode = otpGenerator.generate(6, {
      upperCase: true,
      specialChars: true,
      alphabets: true,
    });

    const createdCampaign = new Campaign({
      campaignName,
      email,
      password: hashedPassword,
      startDate,
      endDate,
      election,
      state,
      level,
      district,
      role,
      campaignCode,
      county,
      countyCommission,
      city,
    });

    try {
      createdCampaign.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        } else {
          sendEmail.sendEmail({
            firstName: "",
            lastName: "",
            email: email,
            campaignCode: "Your Campaign Got Registered at Finiks Platform",
            campaignName: campaignName,
            heading: "Campaign Joining",
            message: "We Have Registered Your Campaign at Finiks Platform",
          });
          res.json({
            message: "Campaign Registered",
            success: true,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message:
          "Signing up and creating Campaign failed, please try again later.",
      });
    }
  } else {
    res.json({ message: "Please Enter all the Details", success: false });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  console.log(email, password);

  try {
    existingUser = await Campaign.findOne({ email: email });
  } catch (err) {
    res.json({
      success: false,
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!existingUser) {
    res.json({
      success: false,
      message: "Logging in failed, please try again later.",
    });

    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  if (!isValidPassword) {
    res.json({
      success: false,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  let access_token;
  try {
    access_token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      "myprivatekey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Logging in failed, please try again later.",
    });
    return;
  }
  console.log(existingUser);

  res.json({
    message: "you are login success fully ",
    username: existingUser.campaignName,
    id: existingUser._id,
    email: existingUser.email,
    access_token: access_token,
    success: true,
    role: existingUser.role,
    campaignCode: existingUser.campaignCode,
  });
};

const updateCampaignData = async (req, res) => {
  const { campaignDates, campaignLogo, campaignCode, campaignId } = req.body;
  // console.log(req.body);
  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = Campaign.updateOne(
      { _id: campaignId },

      {
        $set: {
          campaignDates,
          campaignLogo,
          campaignCode,
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
            message: "Campaign Updated",
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
const getNewCode = async (req, res) => {
  let code = otpGenerator.generate(6, {
    upperCase: true,
    specialChars: true,
    alphabets: true,
  });
  console.log(code);
  if (code) {
    res.json({
      message: "New Code genrated ",
      code,
      success: true,
    });
  } else {
    res.json({
      message: "New Code genrated Error ",
      success: true,
    });
  }
};

const getCampaignData = async (req, res) => {
  console.log(req.body);
  const campaignData = await Campaign.findOne({ _id: req.body.campaignId });
  console.log(campaignData);
  if (campaignData) {
    res.json({
      success: true,
      message: "Campaign Data found",
      values: {
        campaignLogo: campaignData.campaignLogo
          ? campaignData.campaignLogo
          : "",
        campaignCode: campaignData.campaignCode
          ? campaignData.campaignCode
          : "",
        campaignDates: campaignData.campaignDates
          ? campaignData.campaignDates
          : {
              electionDay: "",
              campaignFilingDates: "",
              lastDateSignup: "",
              lastDateRegister: "",
              voteEarlyDate: "",
            },
      },
    });
  }
};

const getTeamMembers = async (req, res) => {
  const { campaignId } = req.body;

  const campaignFound = await Campaign.findOne({ _id: campaignId });
  console.log(campaignFound);

  let teamMembers = campaignFound.teamMembers;
  console.log(teamMembers);
  let teamMembersEmails = campaignFound.teamMembers.map((member) => {
    return member.email;
  });
  console.log(teamMembersEmails, "Emails");

  const foundTeam = await Team.find({ email: teamMembersEmails }, "-password");
  console.log(foundTeam, "found Team");

  const finalTeams = foundTeam.map((member) => {
    // let matchedMember = teamMembers.find(
    //   (memberObject) => memberObject.email === member.email
    // );
    // console.log(matchedMember, member, "i a matched");

    let campaign = member.campaignJoined.find(
      (campaign) => campaign.campaignId.toString() === campaignId
    );
    if (campaign) {
      return {
        memberName: `${member.firstName} ${member.lastName}`,
        permission: member?.permission,
        email: member?.email,
        phoneNumber: member?.phoneNumber,
        dateJoined: member?.dateJoined?.toString().split("G")[0],
        votersInfluenced: campaign?.votersInfluenced,
        doorsKnocked: campaign?.doorsKnocked,
        votersSurveyed: campaign?.votersSurveyed,
        votersMessaged: campaign?.votersMessaged,
        phonesCalled: campaign?.phonesCalled,
      };
    }
  });

  console.log(finalTeams);

  if (finalTeams?.length > 0) {
    res.json({
      message: "Team found",
      team: finalTeams,
      success: true,
    });
  } else {
    res.json({
      message: "Team Not found make new one",
      success: false,
    });
  }
};

const getCampaignTeammembers = async (req, res) => {
  console.log(req.body);

  let foundTeammembers = await Team.find({ email: { $in: req.body.emails } });
  console.log(foundTeammembers);

  if (foundTeammembers) {
    if (foundTeammembers?.length > 0) {
      foundTeammembers = foundTeammembers.map((member) => {
        let campaignData = member.campaignJoined.find(
          (campaign) =>
            campaign.campaignId.toString() === req.body.campaignId.toString()
        );
        return {
          email: member.email,
          memberName: `${member.firstName} ${member.lastName}`,
          phoneNumber: member.phoneNumber,
          ...campaignData,
        };
      });
    }

    console.log(foundTeammembers, "yooo team");

    res.json({
      success: true,
      message: "Team members found",
      foundTeammembers,
    });
  } else {
    res.json({ success: false, message: "Team members not found" });
  }
};

module.exports = {
  register,
  login,
  updateCampaignData,
  getNewCode,
  getCampaignData,
  getTeamMembers,
  getCampaignTeammembers,
};
