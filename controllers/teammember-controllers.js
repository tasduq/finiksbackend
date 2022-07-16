const Teammember = require("../Models/Teammember");
const Campaign = require("../Models/Campaign");
const bcrypt = require("bcryptjs");
var otpGenerator = require("otp-generator");
var sendEmail = require("../Utils/Sendemail");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { firstName, lastName, email, password, address, phoneNumber } =
    req.body;
  console.log(req.body);

  if (email && password) {
    let existingTeammember;
    try {
      existingTeammember = await Teammember.findOne({ email: email });
      existingCampaign = await Campaign.findOne({ email: email });

      if (existingTeammember) {
        console.log("Teammember already exists");
        res.json({
          message: "Teammember Email Already Exists",
          success: false,
        });
        return;
      }

      if (existingCampaign) {
        console.log("Email already exists");
        res.json({
          message: "Email Already Exists",
          success: false,
        });
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

    //   let campaignCode = otpGenerator.generate(6, {
    //     upperCase: true,
    //     specialChars: true,
    //     alphabets: true,
    //   });

    const createdTeammember = new Teammember({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    });

    try {
      createdTeammember.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        } else {
          res.json({
            message: "Teammember Registered",
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
          "Signing up and creating Teammember failed, please try again later.",
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
    existingUser = await Teammember.findOne({ email: email });
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
    firstName: existingUser.firstName,
    id: existingUser._id,
    email: existingUser.email,
    access_token: access_token,
    success: true,
    campaignJoined: existingUser.campaignJoined,
  });
};

const sendInvite = async (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
    permission,
    image,
    about,
    campaignId,
    campaignCode,
    campaignName,
  } = req.body;

  sendEmail.sendEmail({
    firstName,
    lastName,
    email,
    campaignCode,
    campaignName,
    heading: "Campaign Joining Code",
    message: "We are inviting you for joining our campaign",
  });

  // const campaignFound = await Campaign.findOne({_id : campaignId})

  try {
    let ad = Campaign.updateOne(
      { _id: campaignId },

      {
        $push: {
          invitedTeamMembers: { email, permission },
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
            message: "User Invited",
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

const joinCampaign = async (req, res) => {
  const { campaignCode, email } = req.body;

  const campaignFound = await Campaign.findOne({ campaignCode: campaignCode });
  console.log(campaignFound);

  if (campaignFound) {
    // let alreadyJoined = campaignFound.teamMembers.map((member) => {
    //   if (member.email === email) {
    //     alreadyJoined = true;
    //     return;
    //   }
    // });

    let alreadyJoined = campaignFound.teamMembers.some(
      (member) => member.email === email
    );

    if (alreadyJoined) {
      res.json({ message: "You have already joined the campaign" });
      return;
    }

    let invited = false;
    let invitedMember = campaignFound.invitedTeamMembers.find((member) => {
      if (member.email === email) {
        invited = true;
        return member;
      }
    });

    if (invited) {
      try {
        let ad = Campaign.updateOne(
          { _id: campaignFound._id },

          {
            $push: {
              teamMembers: {
                ...invitedMember,
                dateJoined: new Date(),
                votersInfluenced: 0,
                doorsKnocked: 0,
                votersSurveyed: 0,
                votersMessaged: 0,
                phonesCalled: 0,
              },
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
              Teammember.updateOne(
                { email: email },
                {
                  $push: {
                    campaignJoined: {
                      campaignId: campaignFound._id,
                      permission: invitedMember.permission,
                      dateJoined: new Date(),
                      votersInfluenced: 0,
                      campaignName: campaignFound.campaignName,
                    },
                  },
                },
                (err) => {
                  if (err) {
                    console.log(err);
                    res.json({
                      success: false,
                      message: "Something went wrong",
                    });
                    return;
                  } else {
                    res.json({
                      success: true,
                      message: "You have joined the campaign",
                    });
                    return;
                  }
                }
              );
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
      res.json({ message: "You are not invited to join the campaign" });
      return;
    }
  } else {
    res.json({
      message: "Campaign Not found wrong Code or you are not invited",
    });
  }
};

module.exports = {
  register,
  login,
  sendInvite,
  joinCampaign,
};
