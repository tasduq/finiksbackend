const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const canvassingController = require("../controllers/canvassing-controllers");

const router = express.Router();

router.post(
  "/querycanvassing",
  verifyToken,
  canvassingController.queryCanvassing
);
router.post("/saverecord", verifyToken, canvassingController.saveRecord);
router.post("/updaterecord", verifyToken, canvassingController.updateRecord);
router.post("/getrecords", verifyToken, canvassingController.getRecords);
router.post("/savelist", verifyToken, canvassingController.saveList);
router.post("/getlists", verifyToken, canvassingController.getLists);
router.post(
  "/getlistsforcanvassing",
  verifyToken,
  canvassingController.getListsForCanvassing
);
router.post("/updatelist", verifyToken, canvassingController.updateList);
router.post("/editlist", verifyToken, canvassingController.editList);
router.post("/deletelist", verifyToken, canvassingController.deleteList);
router.post(
  "/searchvotersforcanvassing",
  verifyToken,
  canvassingController.searchVoter
);
router.post(
  "/searchcanvassinglists",
  verifyToken,
  canvassingController.searchCanvassingList
);

module.exports = router;
