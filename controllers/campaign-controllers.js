const Campaign = require("../Models/Campaign");
const Team = require("../Models/Teammember");
const Aristotle = require("../Models/Aristotledata");
const CampaignDataBucket = require("../Models/Campaigndatabucket");
const bcrypt = require("bcryptjs");
var otpGenerator = require("otp-generator");
var sendEmail = require("../Utils/Sendemail");
const {
  JWTKEY,
  superAdminCode,
  campaignManagerCode,
} = require("../Config/config");
const ImageProcessor = require("../Utils/Imageprocesor");

const jwt = require("jsonwebtoken");
const { isBase64 } = require("../Utils/CheckBase64");

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

const register = async (req, res, next) => {
  console.log(req.body, "i am bucket data");
  // return;
  let {
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
  // console.log(req.body);
  email = email?.toLowerCase();

  if (campaignName && email && state && level && startDate && endDate) {
    // let buildQuery = (state, level) => {
    //   let query = {
    //     STATE: state,
    //   };

    //   if (level === "Federal - Senate" || level === "State - Statewide") {
    //     query = {
    //       STATE: state,
    //     };
    //   }

    //   if (level === "Federal - House") {
    //     query = {
    //       STATE: state,
    //       [campaignLevelMappedValues[level]]: { $in: district },
    //     };
    //   }

    //   if (level === "State - Senate" || level === "State - House") {
    //     query = {
    //       STATE: state,
    //       [campaignLevelMappedValues[level]]: { $in: district },
    //     };
    //   }

    //   if (
    //     level === "County - County Wide" ||
    //     level === "County - County Commision"
    //   ) {
    //     query = {
    //       STATE: state,
    //       [campaignLevelMappedValues[level]]: { $in: countyCommission },
    //     };
    //   }

    //   if (level === "City - City Wide") {
    //     query = {
    //       STATE: state,
    //       [campaignLevelMappedValues[level]]: { $in: city },
    //     };
    //   }

    //   return query;
    // };

    // let foundQuery = buildQuery(state, level);
    // console.log(foundQuery, "i am final query");

    // let resolvedCampaignData;

    // try {
    //   let campaignData = Aristotle.aggregate([
    //     {
    //       $match: foundQuery,
    //     },
    //   ]);

    //   resolvedCampaignData = await campaignData;

    //   // Process the resolvedCampaignData here if successful.
    //   console.log("Aggregation result:", resolvedCampaignData);
    // } catch (error) {
    //   // Handle the error here.
    //   console.error("Error during aggregation:", error);
    //   res.json({
    //     success: false,
    //     data: err,
    //     message: "Something went wrong , Code: #databucketresultsfailed",
    //   });
    //   return;
    // }
    // console.log(resolvedCampaignData.length, "i am resolved");
    // return;

    let existingCampaign;
    try {
      existingCampaign = await Campaign.findOne({ campaignName: campaignName });

      if (existingCampaign) {
        console.log("Campaign already exists");
        res.json({ message: "Campaign Name Already Exists", success: false });
        return;
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message: "Registering the campaign failed, please try again later.",
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
      // email,
      // password: hashedPassword,
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
      createdCampaign.save((err, doc) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            data: err,
            message: "Registering campaign Failed, please try again later.",
          });
          return;
        } else {
          sendEmail.sendEmail({
            firstName: "",
            lastName: "",
            email: email,
            campaignCode: "Your Campaign Got Registered at Finiks Platform",
            campaignName: campaignName,
            heading: "Campaign Registered",
            message: `We Have Registered Your Campaign at Finiks Platform. You can Login at  http://www.finiksapp.com/logins  and if you are not already part of the platform you can register here at http://www.finiksapp.com/team/register and your campaign joining code is ${campaignCode}`,
          });

          let yoo = doc?.invitedTeamMembers;
          console.log(yoo, "yoo1");
          yoo = yoo.filter((subYoo) => subYoo.email !== email);
          console.log(yoo, "yoo1");
          yoo = [
            ...yoo,
            {
              email,
              permission: "campaignManager",
              campaignPosition: "Campaign Admin",
            },
          ];
          console.log(yoo, "yoo1");
          try {
            let ad = Campaign.updateOne(
              { _id: doc._id },

              {
                $set: {
                  invitedTeamMembers: yoo,
                },
              },
              function (err) {
                console.log(err);
                if (err) {
                  res.json({
                    success: false,
                    message:
                      "Something went wrong Code: #inviteteammemberfailed",
                  });
                  return;
                } else {
                  //creating the daata bucket for the campaign
                  // console.log(doc._id, "i am id of campaign");
                  // let newDataBucketCreated = new CampaignDataBucket({
                  //   campaignId: doc._id,
                  //   campaignData: resolvedCampaignData,
                  // });
                  // newDataBucketCreated.save((err) => {
                  //   if (err) {
                  //     console.log(err);
                  //     res.json({
                  //       success: false,
                  //       data: err,
                  //       message:
                  //         "Data bucket creation failed Code: #Databucketsavingfailed",
                  //     });
                  //     return;
                  //   } else {

                  //   }

                  // });
                  res.json({
                    message: "Campaign Registered suscessfully",
                    success: true,
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
              message: "Something went wrong Code:#emailsendingfailed",
            });
            return;
          }
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
    res.json({
      message: "Please Enter or select all the required fields",
      success: false,
    });
    return;
  }
};

const login = async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser;

  console.log(email, password);
  email = email?.toLowerCase();

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
    let member = await Campaign.find(
      {
        teamMembers: {
          $elemMatch: { email: email, permission: "campaignManager" },
        },
      },
      ["campaignCode", "campaignDates", "campaignLogo", "campaignName"]
    );
    console.log(member, "member");
    // if (member?.length > 0) {
    let memberData = await Team.findOne({ email: email }, [
      "firstName",
      "lastName",
      "campaignLogo",
      "emailVerified",
      "password",
      "phoneNumber",
      "address",
      "campaignJoined",
    ]);
    console.log(memberData, "memberData");
    let yoo = member.map((campaignFound) => {
      let campaignJoined = memberData.campaignJoined.find(
        (campaign) => campaign?.campaignId == campaignFound._id
      );
      if (campaignJoined) {
        return campaignJoined;
      }
    });

    console.log(yoo, "yuooooooooo");

    yoo = yoo.filter((subYoo) => subYoo !== undefined);
    console.log(yoo, "yuooooooooo");

    let finalCampaigns = member.map((campaign) => {
      console.log(campaign, "campaign");
      let foundJoinedCampaign = yoo.find((subYoo) => {
        console.log(subYoo, "subyoooo");
        return subYoo.campaignId.toString() === campaign._id.toString();
      });

      return {
        campaignName: campaign?.campaignName,
        campaignCode: campaign?.campaignCode,
        campaignLogo: campaign?.campaignLogo,
        campaignDates: campaign?.campaignDates,
        disabled: foundJoinedCampaign?.disabled,
        permission: foundJoinedCampaign?.permission,
        _id: campaign?._id,
      };
    });

    console.log(finalCampaigns, "finalcampiagns");

    if (memberData) {
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, memberData.password);
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
          { userId: member._id, email: email, roleCode: campaignManagerCode },
          JWTKEY,
          {
            expiresIn: "23h",
          }
        );
      } catch (err) {
        res.json({
          success: false,
          data: err,
          message: "Logging in failed, please try again later.",
        });
        return;
      }

      res.json({
        message: "You Are Logged In Successfully",
        username: `${memberData.firstName} ${memberData.lastName}`,
        id: "",
        userId: memberData._id,
        email: email,
        access_token: access_token,
        success: true,
        role: existingUser?.role ?? "campaignManager",
        campaignCode: "",
        campaignName: "",
        campaignLogo: memberData.campaignLogo,
        teamLogin: true,
        campaigns: finalCampaigns,
        phoneNumber: memberData.phoneNumber,
        address: memberData.address,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
      });
      return;
    } else {
      res.json({
        success: false,
        message: "You are not a member",
      });
      return;
    }
    // } else {
    //   res.json({
    //     success: false,
    //     message: "You dont have access",
    //   });

    //   return;
    // }
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
      {
        userId: existingUser._id,
        email: existingUser.email,
        roleCode: superAdminCode,
      },
      JWTKEY,
      { expiresIn: "23h" }
    );
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Logging in failed, please try again later.",
    });
    return;
  }
  // console.log(existingUser);

  res.json({
    message: "You Are Logged In Successfully ",
    username: existingUser.campaignName,
    id: existingUser._id,
    userId: existingUser._id,
    email: existingUser.email?.toLowerCase(),
    access_token: access_token,
    success: true,
    role: existingUser.role,
    campaignCode: existingUser.campaignCode,
    campaignName: existingUser.campaignName,
    campaignLogo: existingUser.campaignLogo,
    teamLogin: false,
    phoneNumber: existingUser.phoneNumber,
    address: existingUser.address,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    campaigns: [],
  });
  return;
};

const updateCampaignData = async (req, res) => {
  let { campaignDates, campaignLogo, campaignCode, campaignId } = req.body;
  // console.log(req.body);
  try {
    // console.log(uploadImages, "yoooo ====>");
    let imagesUploaded = [""];
    if (campaignLogo?.length > 0) {
      imagesUploaded = await ImageProcessor.uploadImages([campaignLogo]);
      console.log(imagesUploaded, "i am uploaded images of campaign logo");
    }

    let ad = Campaign.updateOne(
      { _id: campaignId },

      {
        $set: {
          campaignDates,
          campaignLogo: imagesUploaded[0],
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

const updateProfile = async (req, res) => {
  let {
    firstName,
    lastName,
    address,
    phoneNumber,
    teamLogin,
    id,
    campaignLogo,
  } = req.body;
  console.log(req.body);

  let imagesUploaded = [""];
  console.log(isBase64(campaignLogo), "i am campaign logo ===>>>");
  if (isBase64(campaignLogo)) {
    imagesUploaded = await ImageProcessor.uploadImages([campaignLogo]);
  }
  console.log(imagesUploaded, "i am uploaded images of campaign logo");

  if (teamLogin === "true") {
    try {
      // ad = await Ad.findOne({ _id: id });

      let ad = Team.updateOne(
        { _id: id },

        {
          $set: {
            firstName,
            lastName,
            address,
            phoneNumber,
            campaignLogo: imagesUploaded[0],
            image: imagesUploaded[0],
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
              message: "Profile Updated",
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
    try {
      // ad = await Ad.findOne({ _id: id });

      let ad = Campaign.updateOne(
        { _id: id },

        {
          $set: {
            firstName,
            lastName,
            address,
            phoneNumber,
            campaignLogo: imagesUploaded[0],
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
              message: "Campaign Profile Updated",
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
    return;
  } else {
    res.json({
      message: "New Code genrated Error ",
      success: true,
    });
    return;
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
        campaignName: campaignData.campaignName,
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
        campaignExtraData: campaignData,
      },
    });
    return;
  } else {
    res.json({
      success: false,
      message: "No Data Found for Campaign",
    });
  }
};

const getCampaignFilterData = async (req, res) => {
  console.log(req.body);
  const campaignData = await Campaign.findOne({ _id: req.body.campaignId }, [
    "state",
    "district",
    "county",
    "city",
    "level",
    "countyCommission",
  ]);
  console.log(campaignData);
  if (campaignData) {
    res.json({
      success: true,
      message: "Campaign Data found",
      values: campaignData,
    });
    return;
  } else {
    res.json({ success: false, message: "Campaign Data not found" });
    return;
  }
};

const getTeamMembers = async (req, res) => {
  let { campaignId } = req.body;

  const campaignFound = await Campaign.findOne(
    { _id: campaignId },
    "teamMembers"
  );
  console.log(campaignFound);

  let teamMembers = campaignFound.teamMembers;
  console.log(teamMembers);
  let teamMembersEmails = campaignFound.teamMembers.map((member) => {
    return member.email;
  });
  console.log(teamMembersEmails, "Emails");

  const foundTeam = await Team.find({ email: teamMembersEmails }, [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "campaignJoined",
  ]);
  console.log(foundTeam, "found Team");

  const finalTeams = foundTeam.map((member) => {
    console.log(member, "member");
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
        permission: campaign?.permission,
        campaignPosition: campaign?.campaignPosition,
        email: member?.email,
        phoneNumber: member?.phoneNumber,
        dateJoined: campaign?.dateJoined?.toString().split("G")[0],
        votersInfluenced: campaign?.votersInfluenced,
        doorsKnocked: campaign?.doorsKnocked,
        votersSurveyed: campaign?.votersSurveyed,
        votersMessaged: campaign?.votersMessaged,
        phonesCalled: campaign?.phonesCalled,
        disabled: campaign?.disabled,
      };
    }
  });

  console.log(finalTeams, "finalTeams");

  if (finalTeams?.length > 0) {
    res.json({
      message: "Team found",
      team: finalTeams,
      success: true,
    });
    return;
  } else {
    res.json({
      message: "Team Not found make new one",
      success: false,
    });
    return;
  }
};

const getTeamAdmin = async (req, res) => {
  console.log(req.body, "heloooo");
  const teamAdmin = await Campaign.findOne({ _id: req.body.campaignId }, [
    "campaignName",
    "startDate",
    "email",
  ]);

  if (teamAdmin) {
    res.json({ success: true, team: teamAdmin, message: "Team Admin Found" });
    return;
  } else {
    res.json({ success: false, message: "Admin Not found" });
    return;
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
    return;
  } else {
    res.json({ success: false, message: "Team members not found" });
    return;
  }
};

module.exports = {
  register,
  login,
  updateCampaignData,
  getNewCode,
  getCampaignData,
  getTeamMembers,
  getTeamAdmin,
  getCampaignTeammembers,
  getCampaignFilterData,
  updateProfile,
};
