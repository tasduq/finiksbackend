const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const aristotleRoutes = require("./Routes/Aristotle-routes");
const finiksRoutes = require("./Routes/Finiks-routes");
const phonebankRoutes = require("./Routes/Phonebank-routes");
const canvassingRoutes = require("./Routes/Canvassing-routes");
const listRoutes = require("./Routes/List-routes");
const campaignRoutes = require("./Routes/Campaign-routes");
const teammemberRoutes = require("./Routes/Teammember-routes");
const clientsRoutes = require("./Routes/Clients-routes");
const scriptRoutes = require("./Routes/Script-routes");
const surveyRoutes = require("./Routes/Survey-routes");
const tagsRoutes = require("./Routes/Tags-routes");
const reportaproblemRoutes = require("./Routes/Reportaproblem-routes");
const settings = require("./Routes/Settings-routes");
const PORT = process.env.PORT || 3002;
const { dbStage, dbProd } = require("./Config/config");

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
app.use("/api/list", listRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/teammember", teammemberRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/script", scriptRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/reportaproblem", reportaproblemRoutes);
app.use("/api/settings", settings);

// let db;
mongoose
  .connect(dbStage, {
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
