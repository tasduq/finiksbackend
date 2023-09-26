const jwt = require("jsonwebtoken");
// const { JWTKEY } = require("../Config/config");
const {
  JWTKEY,
  teamCode,
  superAdminCode,
  campaignManagerCode,
} = require("../Config/config");

const secretKey = JWTKEY; // Replace with your own secret key
const rolesCode = {
  superadmin: superAdminCode,
  campaignManager: campaignManagerCode,
  team: teamCode,
};

function verifyToken(req, res, next) {
  // console.log(req.header, req.headers, "i am headers");
  const token = req.headers.authorization.split(" ")[2];
  // console.log(token, secretKey, "i am token");
  const role = req.headers.authorization.split(" ")[0];
  // console.log(role, "i a role");
  const roleCodeFound = rolesCode[role];
  // console.log(roleCodeFound, "i am rolecode found");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided.", success: false });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded, "i am decoded data");
    req.user = decoded;
    if (roleCodeFound === decoded?.roleCode) {
      next();
    } else {
      return res.status(401).json({
        message: "You are not Authorized",
        success: false,
        code: 401,
      });
    }
  } catch (err) {
    // console.log("error block", err);
    return res
      .status(401)
      .json({ message: "Invalid token. Login Again", success: false });
  }
}

module.exports = verifyToken;
