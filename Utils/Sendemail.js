const nodemailer = require("nodemailer");

const sendEmail = (data) => {
  console.log(data, "hello gggggg");
  if (data) {
    console.log("Things going good");
    const output = `
              
              <h3>${data.campaignName}</h3>
              <p>${data.firstName}</p>
              <p>We are Inviting Your for Our Campaign</p>
              <ul>  
                <li>Registered for: ${data.email}</li>
              </ul>
              <h3>Campaign Joining Code</h3>
              <p>${data.campaignCode}</p>
              `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.google.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      service: "gmail",
      auth: {
        user: "finiksplatform@gmail.com", // generated ethereal user
        pass: "arbauveuuyjhfjdl", // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Finiks Official" <finiksplatform@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "Campaign Invite", // Subject line
      // text: details, // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error, "I am error");
        return error;
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // let emailOtp = new Emailotp({
        //   email,
        //   otp,
        // });
        // await emailOtp.save();
        // res.status(200).json({ message: "Check Your Email" });
        // return true;
      }
    });
    return true;
  } else {
    // res.status(401).json({ message: "Something went Wrong" });
    console.log("There is problem");
    return false;
  }
};

// export { sendEmail };

module.exports = {
  sendEmail,
};
