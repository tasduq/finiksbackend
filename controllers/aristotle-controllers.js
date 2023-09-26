const Aristotle = require("../Models/Aristotledata");
const Finiks = require("../Models/Finiksdata");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const XLSX = require("xlsx");
const { Readable, Transform } = require("stream");

const getAristotleDataTotalCount = async (req, res) => {
  try {
    let count = 0;
    count = await Aristotle.countDocuments();
    console.log("Number of documents in the collection:", count);
    res.json({
      success: true,
      aristotleDataTotal: count,
      message: "Aristotle Data found",
    });
    return;
  } catch (err) {
    console.error("Error counting documents:", err);
    res.json({
      success: false,
      message: "Something went wrong , #aristotlecountfailed",
    });
    return;
  }
};

const getAristotledata = async (req, res) => {
  const { bottomHit } = req.body;
  console.log(bottomHit);
  const data = await Aristotle.find({})
    .sort({ _id: 1 })
    .skip(bottomHit > 0 ? (bottomHit - 1) * 100 : 0)
    .limit(10);

  if (data) {
    console.log("data found", data.length);
    res.json({
      success: true,
      aristotleData: data,
      message: "Aristotle Data found",
    });
    return;
  } else {
    res.json({
      success: false,
      message: "Aristotle Data Not found",
    });
    return;
  }
};

const addAristotleData = async (req, res) => {
  //   const { fileData } = req.body;
  //   const { voters } = req.body;

  console.log(req.file);
  const result = excelToJson({
    source: req.file.buffer, // fs.readFileSync return a Buffer
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });

  // console.log(result, "i am result");

  if (!result.sheet1 && !result.Sheet1) {
    console.log("Convert Sheet name to sheet1 or Sheet1");
    res.json({
      succes: false,
      message: "Convert Sheet name to sheet1 or Sheet1",
    });
    return;
  }
  let saveVoter = [];
  if (result.sheet1) {
    saveVoter = [...result.sheet1];
  } else {
    saveVoter = [...result.Sheet1];
  }
  saveVoter.splice(0, 1);
  // console.log(saveVoter);
  // filter = { 'API_ID'}

  // saveVoter.map(async (voter) => {
  //   Aristotle.collection.updateOne(
  //     { API_ID: voter.API_ID },
  //     { $set: { ...voter } },
  //     { upsert: true },
  //     async function (err, docs) {
  //       if (err) {
  //         console.log(err);
  //         res.json({ success: false, message: "Error in saving Data" });
  //         return;
  //       } else {
  //         console.log("Multiple documents inserted to Aristotle Collection");
  //         await Finiks.collection.updateOne(
  //           { API_ID: voter.API_ID },
  //           { $set: { ...voter } },
  //           { upsert: true }
  //         );

  //         if (!res.headersSent) {
  //           res.json({
  //             success: true,
  //             message: "Aristotle Data and Finiks Data Saved",
  //           });
  //           return;
  //         }
  //       }
  //     }
  //   );
  // });

  try {
    const saveVoterPromises = saveVoter.map(async (voter, i) => {
      console.log("Adding multiple documents to DB", i);
      await Aristotle.collection.updateOne(
        { API_ID: voter.API_ID },
        { $set: { ...voter } },
        { upsert: true }
      );

      await Finiks.collection.updateOne(
        { API_ID: voter.API_ID },
        { $set: { ...voter } },
        { upsert: true }
      );
    });

    // Wait for all updateOne operations to complete
    await Promise.all(saveVoterPromises);

    // Respond with success message
    res.json({
      success: true,
      message: "Aristotle Data and Finiks Data Saved",
    });
  } catch (error) {
    // Handle errors and send an appropriate error response
    console.error("Error in saving data:", error);

    // You can also log the error for debugging purposes

    // Send an error response to the frontend
    res.json({
      success: false,
      message: "Something went wrong #savingvoterstodbcrashed",
    });

    // Pass the error to the next middleware (e.g., for global error handling)
  }
};

// trying to create optimized version
const addAristotleData2 = async (req, res) => {
  console.log(req.file, "i am file");
  const fileStream = Readable.from([req.file.buffer]); // Assuming req.file.buffer is a Readable stream
  // console.log(fileStream, "i am file");
  // return;

  // Use a stream-based XLSX parser (xlsx library)
  const workbook = XLSX.read(fileStream, { type: "buffer" });
  console.log(workbook, "i am workbook");
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  console.log(worksheet, "i am file");
  return;

  const batchInsertSize = 500; // Adjust the batch size as needed
  let batch = [];

  // Create a readable stream for processing the XLSX data
  const xlsxStream = new Readable({
    read() {
      let row = 1; // Start from the first row
      while (row <= batchInsertSize) {
        const cell = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (!worksheet[cell]) {
          // No more data in the sheet
          break;
        }
        const rowData = XLSX.utils.sheet_to_json(worksheet, { range: row });
        batch.push(rowData[0]); // Assuming one row corresponds to one document

        // Move to the next row
        row++;
      }

      if (batch.length === 0) {
        // No more data to process
        this.push(null); // Signal the end of the stream
      } else {
        // Push the batch to the stream
        this.push(JSON.stringify(batch));
        batch = [];
      }
    },
  });

  // Create a transform stream for parsing JSON strings to objects
  const jsonStream = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      try {
        const jsonData = JSON.parse(chunk);
        callback(null, jsonData);
      } catch (error) {
        callback(error);
      }
    },
  });

  // Pipe the XLSX stream to the JSON stream
  fileStream.pipe(xlsxStream);

  // Process each batch of data and perform batch inserts
  jsonStream.on("data", async (batchData) => {
    try {
      const saveVoterPromises = batchData.map(async (voter, i) => {
        console.log("Adding multiple documents to DB", i);
        await Promise.all([
          Aristotle.collection.updateOne(
            { API_ID: voter.API_ID },
            { $set: { ...voter } },
            { upsert: true }
          ),
          Finiks.collection.updateOne(
            { API_ID: voter.API_ID },
            { $set: { ...voter } },
            { upsert: true }
          ),
        ]);
      });

      // Wait for all updateOne operations to complete
      await Promise.all(saveVoterPromises);
    } catch (error) {
      console.error("Error in saving data:", error);
    }
  });

  // When the JSON stream ends, send the response
  jsonStream.on("end", () => {
    // Respond with success message
    res.json({
      success: true,
      message: "Aristotle Data and Finiks Data Saved",
    });
  });

  // When an error occurs in the stream, handle it
  jsonStream.on("error", (error) => {
    console.error("Stream error:", error);

    // Send an error response to the frontend
    res.json({
      success: false,
      message: "Something went wrong #streamerror",
    });
  });
};

const editVoter = async (req, res) => {
  const { voterId } = req.body;
  console.log(voterId);

  //   const voter = await Aristotle.findOne({ _id: voterId });
  //   console.log(voter);
  //   if (voter) {
  // let newData = { ...voter._doc, tag: "New Tag" };
  // console.log(newData);

  Aristotle.updateOne(
    { _id: voterId },
    {
      $set: { tag: "New tag" },
    }
  )
    .then((response) => {
      console.log(response);
      res.json({ success: true, message: "Voter Updated" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "Voter  Updating Error" });
    });
  //   } else {
  //     res.json({ success: false, message: "Not Found" });
  //   }
};

module.exports = {
  getAristotledata,
  addAristotleData,
  editVoter,
  getAristotleDataTotalCount,
};
