require("./Models/Aristotledata");
require("./Models/Campaign");
require("./Models/Campaignsurveys");
require("./Models/Canvassinglist");
require("./Models/Finiksdata");
require("./Models/Phonebanklists");
require("./Models/Script");
require("./Models/Survey");
require("./Models/Tag");
require("./Models/Teammember");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const aristotleRoutes = require("./Routes/Aristotle-routes");
const finiksRoutes = require("./Routes/Finiks-routes");
const phonebankRoutes = require("./Routes/Phonebank-routes");
const canvassingRoutes = require("./Routes/Canvassing-routes");
const campaignRoutes = require("./Routes/Campaign-routes");
const teammemberRoutes = require("./Routes/Teammember-routes");
const clientsRoutes = require("./Routes/Clients-routes");
const scriptRoutes = require("./Routes/Script-routes");
const surveyRoutes = require("./Routes/Survey-routes");
const tagsRoutes = require("./Routes/Tags-routes");
const PORT = process.env.PORT || 3001;
const { db } = require("./Config/config");

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

  next();
});

app.use("/api/aristotle", aristotleRoutes);
app.use("/api/finiks", finiksRoutes);
app.use("/api/phonebank", phonebankRoutes);
app.use("/api/canvassing", canvassingRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/teammember", teammemberRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/script", scriptRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/tags", tagsRoutes);

// let db;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    //   useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    // console.log(db);
    // console.log(client.connections[0].db);

    // dbAccess = client.connections[0].db;
    // app.set("db", "dbAccess");
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
