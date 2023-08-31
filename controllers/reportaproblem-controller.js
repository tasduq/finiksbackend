const cloudinary = require("cloudinary").v2;
const {
  cloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require("../Config/config");
const Reportaproblem = require("../Models/Reportaproblem");

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const uploadImages = (images) => {
  return Promise.all(
    images.map((base64Image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(base64Image, (error, result) => {
          if (error) {
            console.error(`Error uploading image:`, error);
            reject(error);
          } else {
            console.log(`Image uploaded successfully:`, result.secure_url);
            resolve(result.secure_url);
          }
        });
      });
    })
  );
};

const uploadScreenshots = async (req, res) => {
  const { email, issue, issueDetail, screenshots } = req.body;
  try {
    let uploadedImages = await uploadImages(screenshots);
    console.log(uploadedImages, "Uploaded URLs");
    // Rest of your code to process the uploaded images
    const report = new Reportaproblem({
      email: email,
      issue: issue,
      issueDetail: issueDetail,
      screenShots: uploadedImages, // Assign the array of uploaded URLs
    });

    const savedReport = await report.save(); // Save the document to the database
    console.log("Report saved:", savedReport);

    // Respond to the client as needed
    res
      .status(201)
      .json({ message: "Report submited successfully", success: true });
  } catch (error) {
    console.error("Error uploading screenshots:", error);
    // Handle the error
    res.json({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  uploadScreenshots,
};
