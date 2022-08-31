const Teammember = require("../Models/Teammember");
const Campaign = require("../Models/Campaign");
const Phonebank = require("../Models/Phonebanklists");
const List = require("../Models/List");
const Script = require("../Models/Script");
const Tags = require("../Models/Tag");
const Survey = require("../Models/Survey");
const Finiks = require("../Models/Finiksdata");
const bcrypt = require("bcryptjs");
var otpGenerator = require("otp-generator");
var sendEmail = require("../Utils/Sendemail");
const jwt = require("jsonwebtoken");
const { consumers } = require("nodemailer/lib/xoauth2");

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

    let otp = otpGenerator.generate(6, {
      upperCase: true,
      specialChars: true,
      alphabets: true,
    });

    const createdTeammember = new Teammember({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      emailVerificationCode: otp,
      role: "team",
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
          sendEmail.sendEmail({
            firstName,
            lastName,
            email: email,
            campaignCode: otp,
            campaignName: "",
            heading: "OTP Verification Code",
            message:
              "Kindly Verify Your email for getting registered to the Platform",
          });
          res.json({
            message: "Otp sent to Email",
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

const emailVerify = async (req, res) => {
  console.log(req.body);
  const { otp, email, prevPath } = req.body;
  let user;

  if (prevPath === "/logincampaign") {
    try {
      user = await Campaign.findOne({ email: email }, "-password");
      console.log(user);
      if (user) {
        if (user.emailVerificationCode === otp) {
          Campaign.updateOne(
            { email: email },
            { $set: { emailVerified: true } },
            function (err) {
              if (!err) {
                return res.json({
                  success: true,
                  message: "Email Verified",
                });
              }
            }
          );
        } else {
          res.json({ success: false, message: "Otp Wrong" });
          return;
        }
      }
    } catch (err) {
      return res.json({ success: false, message: "Somthing went wrong" });
    }
  } else {
    try {
      user = await Teammember.findOne({ email: email }, "-password");
      console.log(user);
      if (user) {
        if (user.emailVerificationCode === otp) {
          Teammember.updateOne(
            { email: email },
            { $set: { emailVerified: true } },
            function (err) {
              if (!err) {
                return res.json({
                  success: true,
                  message: "Email Verified",
                });
              }
            }
          );
        } else {
          res.json({ success: false, message: "Otp Wrong" });
          return;
        }
      }
    } catch (err) {
      return res.json({ success: false, message: "Somthing went wrong" });
    }
  }
};

const requestNewEmailOtp = async (req, res) => {
  console.log(req.body);
  const { email, prevPath } = req.body;

  if (prevPath === "/logincampaign") {
    let user = await Campaign.findOne({ email: email }, "-password");
    if (user) {
      let otp = otpGenerator.generate(6, {
        upperCase: true,
        specialChars: true,
        alphabets: true,
      });

      Campaign.updateOne(
        { email: email },
        { $set: { emailVerificationCode: otp } },
        function (err) {
          if (!err) {
            console.log("Otp Email Updated");
            sendEmail.sendEmail({
              // firstName,
              // lastName,
              email: email,
              campaignCode: otp,
              // campaignName: "",
              heading: "OTP Verification Code",
              message: "Kindly Verify Your email ",
            });
            return res.json({
              success: true,
              message: "New OTP Sent to your email",
            });
          } else {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: "User Email not exist",
      });
    }
  } else {
    let user = await Teammember.findOne({ email: email }, "-password");
    if (user) {
      let otp = otpGenerator.generate(6, {
        upperCase: true,
        specialChars: true,
        alphabets: true,
      });

      Teammember.updateOne(
        { email: email },
        { $set: { emailVerificationCode: otp } },
        function (err) {
          if (!err) {
            console.log("Otp Email Updated");
            sendEmail.sendEmail({
              // firstName,
              // lastName,
              email: email,
              campaignCode: otp,
              // campaignName: "",
              heading: "OTP Verification Code",
              message: "Kindly Verify Your email",
            });
            return res.json({
              success: true,
              message: "New OTP Sent to your email",
            });
          } else {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: "User Email not exist",
      });
    }
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

  let campaignsJoined = existingUser?.campaignJoined?.filter(
    (campaign) => campaign.permission !== "campaignManager"
  );

  console.log(campaignsJoined, "campaigns joined");

  res.json({
    message: "you are login success fully ",
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    username: `${existingUser.firstName} ${existingUser.lastName}`,
    id: existingUser._id,
    userId: existingUser._id,
    email: existingUser.email,
    access_token: access_token,
    role: existingUser.role,
    success: true,
    campaignJoined: existingUser.campaignJoined,
    emailVerified: existingUser.emailVerified,
    campaignLogo: existingUser.campaignLogo,
    teamLogin: true,
    phoneNumber: existingUser.phoneNumber,
    address: existingUser.address,
    campaigns: campaignsJoined,
  });
};

const newPassword = async (req, res) => {
  console.log(req.body);

  const { password, email, recentOtp, prevPath } = req.body;
  console.log(password, email, recentOtp, "details");

  if (password && email && recentOtp) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log("Error hashing password", err);

      res.json({
        success: false,
        data: err,
        message: "Something went wrong",
      });
      return;
    }

    if (prevPath === "/logincampaign") {
      try {
        let user = await Campaign.findOne({ email: email }, "-password");
        console.log(user);
        if (user) {
          if (user.emailVerificationCode === recentOtp) {
            Campaign.updateOne(
              { email: email },
              { $set: { password: hashedPassword } },
              function (err) {
                if (!err) {
                  console.log("Updated");
                  return res.json({
                    success: true,
                    message: "Password Updated",
                  });
                } else {
                  // console.log(err);
                  res.json({
                    success: false,
                    data: err,
                    message: "Something went wrong",
                  });
                  return;
                }
              }
            );
          } else {
            res.json({ success: false, message: "Otp Wrong" });
            return;
          }
        } else {
          return res.json({ success: false, message: "Somthing went wrong" });
        }
      } catch (err) {
        return res.json({ success: false, message: "Somthing went wrong" });
      }
    } else {
      try {
        let user = await Teammember.findOne({ email: email }, "-password");
        console.log(user);
        if (user) {
          if (user.emailVerificationCode === recentOtp) {
            Teammember.updateOne(
              { email: email },
              { $set: { password: hashedPassword } },
              function (err) {
                if (!err) {
                  console.log("Updated");
                  return res.json({
                    success: true,
                    message: "Password Updated",
                  });
                } else {
                  // console.log(err);
                  res.json({
                    success: false,
                    data: err,
                    message: "Something went wrong",
                  });
                  return;
                }
              }
            );
          } else {
            res.json({ success: false, message: "Otp Wrong" });
            return;
          }
        } else {
          return res.json({ success: false, message: "Somthing went wrong" });
        }
      } catch (err) {
        return res.json({ success: false, message: "Somthing went wrong" });
      }
    }
  } else {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const sendInvite = async (req, res) => {
  console.log(req.body);
  const {
    // firstName,
    // lastName,
    phoneNumber,
    email,
    address,
    permission,
    campaignPosition,
    image,
    about,
    campaignId,
    campaignCode,
    campaignName,
  } = req.body;

  sendEmail.sendEmail({
    // firstName,
    // lastName,
    email,
    campaignCode,
    campaignName,
    heading: "Campaign Joining Code",
    message: `We are inviting you for joining our campaign. ${about}, login at http://www.finiksapp.com/logins`,
  });

  const campaignFound = await Campaign.findOne(
    { _id: campaignId },
    "invitedTeamMembers"
  );

  let yoo = campaignFound.invitedTeamMembers;
  console.log(yoo, "yoo1");
  yoo = yoo.filter((subYoo) => subYoo.email !== email);
  console.log(yoo, "yoo1");
  yoo = [...yoo, { email, permission, campaignPosition }];
  console.log(yoo, "yoo1");

  try {
    let ad = Campaign.updateOne(
      { _id: campaignId },

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

const addToTeam = async (req, res) => {
  console.log(req.body);
  const { email, campaignId } = req.body;

  console.log(req.body);

  const campaignFound = await Campaign.findOne(
    { _id: campaignId },
    "invitedVoters"
  );

  let yoo = campaignFound.invitedVoters;
  console.log(yoo, "yoo1");
  yoo = yoo.filter((subYoo) => subYoo.email !== email);
  console.log(yoo, "yoo1");
  yoo = [...yoo, { email }];
  console.log(yoo, "yoo1");

  try {
    let ad = Campaign.updateOne(
      { _id: campaignId },

      {
        $set: {
          invitedVoters: yoo,
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
            message: "Voter Invited",
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

const getInvitedVoters = async (req, res) => {
  console.log(req.body);

  const { campaignId } = req.body;

  const campaignFound = await Campaign.findOne(
    { _id: campaignId },
    "invitedVoters"
  );

  if (campaignFound) {
    res.json({
      success: true,
      message: "Found Invited Voters",
      invitedVoters: campaignFound.invitedVoters,
    });
  } else {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const editMember = async (req, res) => {
  console.log(req.body, "body");
  const {
    // firstName,
    // lastName,
    email,
    permission,
    campaignPosition,
    about,
    campaignId,
    campaignCode,
    campaignName,
    disabled,
  } = req.body;

  sendEmail.sendEmail({
    // firstName,
    // lastName,
    email,
    campaignCode,
    campaignName,
    heading: "Campaign Joining Code",
    message: `Your campaign Access Status updated. Now you access level is ${permission?.toUpperCase()} and your active status is ${permission?.toUpperCase()}, login at http://www.finiksapp.com/logins`,
  });

  const campaignFound = await Campaign.findOne(
    { _id: campaignId },
    "teamMembers"
  );

  let yoo = campaignFound.teamMembers;
  console.log(yoo, "yoo1");
  yoo = yoo.map((subYoo) => {
    if (subYoo?.email === email) {
      return {
        ...subYoo,
        permission: permission,
        campaignPosition,
        disabled: disabled,
      };
    } else {
      return subYoo;
    }
  });
  console.log(yoo, "yoo1");
  // yoo = [...yoo, { email, permission }];
  // console.log(yoo, "yoo1");

  try {
    let ad = Campaign.updateOne(
      { _id: campaignId },

      {
        $set: {
          teamMembers: yoo,
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
          Teammember.update(
            {
              email: email,
              "campaignJoined.campaignId": campaignId.toString(),
            },
            {
              $set: {
                "campaignJoined.$.permission": permission,
                "campaignJoined.$.campaignPosition": campaignPosition,
                "campaignJoined.$.disabled": disabled,
              },
            },
            (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Somthing went wrong",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Member Access Status Updated",
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
      res.json({
        message: "You have already joined the campaign",
        success: false,
      });
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
                disabled: false,
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
                      campaignId: campaignFound._id.toString(),
                      permission: invitedMember.permission,
                      campaignPosition: invitedMember.campaignPosition,
                      dateJoined: new Date(),
                      votersInfluenced: 0,
                      doorsKnocked: 0,
                      votersSurveyed: 0,
                      votersMessaged: 0,
                      phonesCalled: 0,
                      campaignName: campaignFound.campaignName,
                      disabled: false,
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
                      message: "You have joined the campaign.",
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

const getJoinedCampaigns = async (req, res) => {
  const { id, role } = req.body;
  console.log(id);

  const joinedCampaigns = await Teammember.findOne(
    { _id: id },
    "campaignJoined"
  );

  let yoo = [];
  if (role === "campaignManager") {
    yoo = joinedCampaigns.campaignJoined.filter(
      (campaign) => campaign.permission === "campaignManager"
    );
  }

  if (role === "team") {
    yoo = joinedCampaigns.campaignJoined.filter(
      (campaign) => campaign.permission !== "campaignManager"
    );
  }

  console.log(joinedCampaigns);
  if (joinedCampaigns) {
    res.json({
      success: true,
      joinedCampaigns: yoo,
    });
  } else {
    res.json({
      success: false,
      message: "Campaigns Not found",
    });
  }
};

const getTeamPhonebankRecords = async (req, res) => {
  const { campaignId, teamMemberEmail } = req.body;
  console.log(req.body);
  if (campaignId && teamMemberEmail) {
    let records = await Phonebank.find({ campaignOwnerId: campaignId });
    console.log(records);
    let memberRecords = records.filter((record) => {
      return (
        record.teamMembers.includes(teamMemberEmail) &&
        record.active === "Active"
      );
    });
    console.log(memberRecords);
    res.json({
      success: true,
      records: memberRecords,
      message: "Found",
    });
  } else {
    res.json({
      success: false,
      message: "campaign is not selected or Email is Invalid",
    });
  }
};

const getList = async (req, res) => {
  console.log(req.body);

  const list = await List.findOne({ _id: req.body.id });
  console.log(list);
  if (list) {
    res.json({ success: true, list });
  } else {
    res.json({ success: false, message: "List not found" });
  }
};

const getScript = async (req, res) => {
  console.log(req.body);

  const script = await Script.findOne({ _id: req.body.id });
  console.log(script);
  if (script) {
    res.json({ success: true, script });
  } else {
    res.json({ success: false, message: "script not found" });
  }
};

const getTags = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  const tags = await Tags.find({ campaignOwnerId: req.body.id });
  console.log(tags);
  if (tags) {
    res.json({
      success: true,
      tags: tags,
    });
  } else {
    res.json({ success: false, message: "Tags not found for the campaign" });
  }
};

const getSurvey = async (req, res) => {
  console.log(req.body);

  let survey = await Survey.findOne({ campaignOwnerId: req.body.id });
  if (survey) {
    res.json({ success: true, survey: survey });
  } else {
    res.json({ success: false, message: "No survey found" });
  }
};

const updateUserPassword = async (req, res) => {
  console.log(req.body);

  const { passwordUpdate, id, teamLogin } = req.body;
  const { oldPassword, newPassword } = passwordUpdate;

  let existingUser;

  if (teamLogin !== "true") {
    try {
      existingUser = await Campaign.findOne({ _id: id }, "password");
      console.log(existingUser);
    } catch (err) {
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );
      console.log(isValidPassword);
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Somthing Went Wrong",
      });
      return;
    }

    if (isValidPassword) {
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
      } catch (err) {
        console.log("Error hashing password", err);

        res.json({
          success: false,
          data: err,
          message: "Something went wrong",
        });
        return;
      }

      Campaign.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } },
        function (err) {
          if (!err) {
            return res.json({ success: true, message: "Password Updated" });
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: "Wrong Old PAssword",
      });
      return;
    }
  } else {
    try {
      existingUser = await Teammember.findOne({ _id: id }, "password");
      console.log(existingUser);
    } catch (err) {
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );
      console.log(isValidPassword);
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Somthing Went Wrong",
      });
      return;
    }

    if (isValidPassword) {
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
      } catch (err) {
        console.log("Error hashing password", err);

        res.json({
          success: false,
          data: err,
          message: "Something went wrong",
        });
        return;
      }

      Teammember.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } },
        function (err) {
          if (!err) {
            return res.json({ success: true, message: "Password Updated" });
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: "Wrong Old PAssword",
      });
      return;
    }
  }
};

const updateVoterInfo = async (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    mobileNumber,
    address,
    listId,
    voterId,
    campaignId,
  } = req.body;

  List.updateOne(
    {
      _id: listId,
      "voters._id": voterId,
    },
    {
      $set: {
        "voters.$.FIRSTNAME": firstName,
        "voters.$.LASTNAME": lastName,
        "voters.$.ADDRESS": address,
        "voters.$.PHONE_NUM": phoneNumber,
        "voters.$.MOBILE_NUM": mobileNumber,
        "voters.$.EMAIL": email,
      },
    },
    async (err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Voter data updation failed",
        });
      } else {
        Finiks.updateOne(
          { _id: voterId },
          {
            $set: {
              FIRSTNAME: firstName,
              LASTNAME: lastName,
              ADDRESS: address,
              PHONE_NUM: phoneNumber,
              MOBILE_NUM: mobileNumber,
              EMAIL: email,
            },
          },
          (err) => {
            if (err) {
              console.log(err);
              res.json({
                success: false,
                message: "Voter data updation failed",
              });
            } else {
              res.json({
                success: true,
                message: "Voter data updated",
              });
            }
          }
        );
      }
    }
  );
};

module.exports = {
  register,
  login,
  sendInvite,
  joinCampaign,
  emailVerify,
  requestNewEmailOtp,
  getJoinedCampaigns,
  getTeamPhonebankRecords,
  getList,
  getScript,
  getTags,
  getSurvey,
  newPassword,
  updateUserPassword,
  editMember,
  addToTeam,
  updateVoterInfo,
  getInvitedVoters,
};
