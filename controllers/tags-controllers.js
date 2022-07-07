const Tag = require("../Models/Tag");
const express = require("express");
const Voter = require("../Models/Finiksdata");

const app = express();

const addTag = async (req, res) => {
  console.log(req.body);

  const { tagName, description, campaignId, type, creatorName, ownerName } =
    req.body;
  const createdTag = new Tag({
    tagName,
    description,
    campaignOwnerId: campaignId,
    type,
    creatorName,
    ownerName,
  });

  try {
    createdTag.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating Tag Failed",
        });
        return;
      } else {
        res.json({
          message: "Tag Saved ",
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Creating Tag Failed. Trying again latter",
    });
  }
};

const editTag = async (req, res, next) => {
  const {
    tagName,
    description,
    campaignId,
    type,
    creatorName,
    ownerName,
    _id,
  } = req.body;
  console.log(req.body);

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = Tag.updateOne(
      { _id: _id },

      {
        $set: {
          tagName,
          description,
          campaignId,
          type,
          creatorName,
          ownerName,
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
            message: "Tag Updated",
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

const getTags = async (req, res) => {
  const tags = await Tag.find({}, "-users");

  let reverse = tags.map((item) => item).reverse();

  if (tags) {
    res.json({
      success: true,
      tags: reverse,
      message: "tags Found for phonebanking",
    });
  } else {
    res.json({
      success: false,
      message: "tags Not Found for phonebanking",
    });
  }
};

const getClientTags = async (req, res) => {
  const campaignsTags = await Tag.find({
    campaignOwnerId: req.body.id,
  });
  console.log(campaignsTags);

  if (campaignsTags) {
    res.json({
      success: true,
      clientData: campaignsTags,
      message: "Campaign Tags Found",
    });
  } else {
    res.json({
      success: false,
      message: "Campaign Tags Not Found",
    });
  }
};

const getTagInfo = async (req, res) => {
  const { tagId } = req.body;
  console.log(req.body);

  const tags = await Tag.findOne({ _id: tagId }, [
    "users",
    "tagName",
    "description",
  ]);

  if (tags) {
    res.json({
      success: true,
      tags,
      message: "tags Found ",
    });
  } else {
    res.json({
      success: false,
      message: "tags Not Found ",
    });
  }
};

const connectTagToUser = async (req, res) => {
  const {
    tagId,
    campaignId,
    campaignName,
    subUserName,
    subUserId,
    voterId,
    voterName,
    recordType,
    geoLocation,
    date,
    time,
  } = req.body;

  try {
    let foundTag = await Tag.findOne({ _id: tagId });

    let ad = Tag.updateOne(
      { _id: tagId },

      {
        $push: {
          users: {
            campaignId,
            campaignName,
            subUserName,
            subUserId,
            voterId,
            voterName,
            recordType,
            geoLocation,
            date,
            time,
          },
        },
      },
      function (err, updatedTag) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          console.log(updatedTag);
          Voter.updateOne(
            { _id: voterId },
            {
              $push: {
                voterTags: {
                  campaignId,
                  campaignName,
                  subUserName,
                  subUserId,
                  voterId,
                  voterName,
                  recordType,
                  geoLocation,
                  date,
                  time,
                  tagId: foundTag._id,
                  tagName: foundTag.tagName,
                },
              },
            },
            (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Something went wrong",
                });
                return;
              } else {
                res.json({
                  success: true,
                  message: "Tag Updated",
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

const getTagsByClients = async (req, res) => {
  const tags = await Tag.find({ type: "campaign" }, "-users");
  console.log(tags);

  let db = req.app.get("db");

  console.log(db);

  let uniqueIds = [];

  tags.map((tag) => {
    if (uniqueIds.includes(tag.campaignOwnerId.toString()) === false) {
      uniqueIds.push(tag.campaignOwnerId.toString());
    }
  });

  console.log(uniqueIds);

  const filterClients = uniqueIds.map((id) => {
    let clientTags = tags.filter((tag) => {
      return tag.campaignOwnerId.toString() === id;
    });
    return {
      tags: clientTags,
      campaignName: clientTags[0].ownerName,
    };
  });
  console.log(filterClients);

  if (filterClients) {
    res.json({
      message: "Found Clients",
      clients: filterClients,
      success: true,
    });
  } else {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const mergeTags = async (req, res) => {
  const { ids } = req.body;
  console.log(ids, "idsss");

  const tags = await Tag.find({ _id: ids });
  console.log(tags, "tags");

  if (tags[0].type === "admin" || tags[1].type === "admin") {
    let adminCount = 0;
    tags.map((tag) => {
      if (tag.type === "admin") {
        adminCount++;
      }
    });

    if (adminCount === 0) {
      res.json({ success: false, message: "No admin Tag selected" });
      return;
    } else if (adminCount === 1) {
      let adminTag = tags.find((tag) => tag.type === "admin");
      let otherTag = tags.find((tag) => tag.type !== "admin");

      adminTag = {
        ...adminTag,
        users: [...adminTag.users, ...otherTag.users],
      };

      try {
        // let foundTag = await Tag.findOne({ _id: tagId });

        let ad = Tag.updateOne(
          { _id: adminTag._id },

          {
            $set: {
              users: adminTag.users,
            },
          },
          async function (err, updatedTag) {
            console.log(err);
            if (err) {
              res.json({
                success: false,
                message: "Something went wrong",
              });
              return;
            } else {
              let removedTag = await Tag.findByIdAndRemove({
                _id: otherTag._id,
              });

              const voterIds = adminTag.users.map((voter) => {
                return voter.voterId;
              });

              console.log(voterIds, "voterids");
              const voters = await Voter.find({ _id: voterIds }, "voterTags");

              let newVoterTags = voters.map((voterTags) => {
                let voterUpdated = voterTags.voterTags.filter((voterTag) => {
                  return voterTag.tagId !== otherTag._id;
                });

                let tagFound = voterUpdated.find(
                  (tag) => tag.tagId.toString() === adminTag._id
                );

                if (tagFound === undefined || tagFound === null) {
                  voterUpdated = [
                    ...voterUpdated,
                    {
                      campaignId: adminTag._id,
                      campaignName: "admin",
                      tagId: adminTag._id,
                      tagName: adminTag.tagName,
                    },
                  ];
                }

                return { ...voterTags, voterTags: voterUpdated };
              });

              console.log(newVoterTags);

              newVoterTags.map((voter, i) => {
                console.log(i);
                Voter.updateOne(
                  { _id: voter._id },
                  {
                    $set: {
                      voterTags: voter.voterTags,
                    },
                  },
                  (err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong",
                      });
                      return;
                    } else {
                      if (i === newVoterTags.length - 1) {
                        console.log("last index and sending res");
                        res.json({
                          success: true,
                          message: "Tag Merged",
                        });
                        return;
                      }

                      return;
                    }
                  }
                );
              });
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
    } else if (adminCount === 2) {
      let adminTag1 = tags[0];
      let adminTag2 = tags[1];

      adminTag1 = {
        ...adminTag1,
        users: [...adminTag1.users, ...adminTag2.users],
      };

      try {
        // let foundTag = await Tag.findOne({ _id: tagId });

        let ad = Tag.updateOne(
          { _id: adminTag1._id },

          {
            $set: {
              users: adminTag1.users,
            },
          },
          async function (err, updatedTag) {
            console.log(err);
            if (err) {
              res.json({
                success: false,
                message: "Something went wrong",
              });
              return;
            } else {
              let removedTag = await Tag.findByIdAndRemove({
                _id: adminTag2._id,
              });
              const voterIds = adminTag1.users.map((voter) => {
                return voter.voterId;
              });

              console.log(voterIds, "voterids");
              const voters = await Voter.find({ _id: voterIds }, "voterTags");

              let newVoterTags = voters.map((voterTags) => {
                let voterUpdated = voterTags.voterTags;

                let tagFound = voterTags.voterTags.find(
                  (tag) => tag.tagId.toString() === adminTag1._id
                );

                if (tagFound === undefined || tagFound === null) {
                  voterUpdated = [
                    ...voterUpdated,
                    {
                      campaignId: adminTag1._id,
                      campaignName: "admin",
                      tagId: adminTag1._id,
                      tagName: adminTag1.tagName,
                    },
                  ];
                }

                return { ...voterTags, voterTags: voterUpdated };
              });

              newVoterTags.map((voter, i) => {
                console.log(i);
                Voter.updateOne(
                  { _id: voter._id },
                  {
                    $set: {
                      voterTags: voter.voterTags,
                    },
                  },
                  (err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong",
                      });
                      return;
                    } else {
                      if (i === newVoterTags.length - 1) {
                        console.log("last i and merging res");
                        res.json({
                          success: true,
                          message: "Tag Merged",
                        });
                        return;
                      }

                      return;
                    }
                  }
                );
              });
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
  } else {
    if (
      tags[0]?.campaignOwnerId.toString() ===
      tags[1]?.campaignOwnerId.toString()
    ) {
      console.log("good");
      let campaignTag1 = tags[0];
      let campaignTag2 = tags[1];

      campaignTag1 = {
        ...campaignTag1,
        users: [...campaignTag1.users, ...campaignTag2.users],
      };

      try {
        // let foundTag = await Tag.findOne({ _id: tagId });

        let ad = Tag.updateOne(
          { _id: campaignTag1._id },

          {
            $set: {
              users: campaignTag1.users,
            },
          },
          async function (err, updatedTag) {
            console.log(err);
            if (err) {
              res.json({
                success: false,
                message: "Something went wrong",
              });
              return;
            } else {
              let removedTag = await Tag.findByIdAndRemove({
                _id: campaignTag2._id,
              });
              console.log(campaignTag1);
              const voterIds = campaignTag1.users.map((voter) => {
                return voter.voterId;
              });

              console.log(voterIds, "Voter Ids");
              if (voterIds.length === 0) {
                res.json({ success: true, message: "Tag Merged" });
                return;
              }
              const voters = await Voter.find({ _id: voterIds }, "voterTags");

              let newVoterTags = voters.map((voterTags) => {
                let voterUpdated = voterTags.voterTags;

                let tagFound = voterTags.voterTags.find(
                  (tag) => tag.tagId.toString() === campaignTag1._id
                );

                if (tagFound === undefined || tagFound === null) {
                  voterUpdated = [
                    ...voterUpdated,
                    {
                      campaignId: campaignTag1._id,
                      campaignName: "campaign",
                      tagId: campaignTag1._id,
                      tagName: campaignTag1.tagName,
                    },
                  ];
                }

                return { ...voterTags, voterTags: voterUpdated };
              });

              newVoterTags.map((voter, i) => {
                Voter.updateOne(
                  { _id: voter._id },
                  {
                    $set: {
                      voterTags: voter.voterTags,
                    },
                  },
                  (err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong",
                      });
                      return;
                    } else {
                      if (i === newVoterTags.length - 1) {
                        res.json({
                          success: true,
                          message: "Tag Merged",
                        });
                        return;
                      }

                      return;
                    }
                  }
                );
              });
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
      res.json({
        message: "Cannot Merge tags of different Campaigns",
        success: false,
      });
    }
  }
};

const deleteTag = async (req, res) => {
  console.log(req.body);

  try {
    ad = await Tag.findByIdAndRemove({ _id: req.body.id });
    console.log(ad);
    ad = true;
    // console.log(res);
    console.log("done");
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Error deleting Tag",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,

      message: "Tag deleted",
    });
  } else {
    res.json({
      success: false,

      message: "Error deleting Tag",
    });
    return;
  }
};

module.exports = {
  addTag,
  getTags,
  getTagInfo,
  connectTagToUser,
  getTagsByClients,
  mergeTags,
  editTag,
  getClientTags,
  deleteTag,
};
