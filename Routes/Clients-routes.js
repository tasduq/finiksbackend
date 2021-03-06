const express = require("express");

const clientsController = require("../controllers/clients-controllers");

const router = express.Router();

// router.post("/loginclients", clientsController.login);
router.get("/getclients", clientsController.getClients);
router.post("/editclient", clientsController.editClient);
router.post("/deleteclient", clientsController.deleteClient);
router.post("/getdistricts", clientsController.getDistricts);

module.exports = router;
