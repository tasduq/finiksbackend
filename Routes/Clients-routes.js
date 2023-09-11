const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const clientsController = require("../controllers/clients-controllers");

const router = express.Router();

// router.post("/loginclients", clientsController.login);
router.get("/getclients", verifyToken, clientsController.getClients);
router.post("/editclient", verifyToken, clientsController.editClient);
router.post("/deleteclient", verifyToken, clientsController.deleteClient);
router.post("/getdistricts", verifyToken, clientsController.getDistricts);
// router.post("/getanalytics", clientsController.getAnalytics);

module.exports = router;
