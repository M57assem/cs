const nodemailer = require('nodemailer');

const {emailTemplate} = require('../email/EmailTemplate')

// ...

async function sendEmailTo(user,link) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
       user: 'smartbracelet88@gmail.com',
        pass: 'rhot bbno yrja xglh' ,
      },
    })
    // send mail with defined transport object
    const mailOptions = {
      from: 'your_username_here>', // sender address
      to: user.Email, // list of receivers
      subject: `Welcome, ${user.Name}` ,
      text: "Welcome", // plain text body
      html: `<a href="${link}" style="background-color: #4CAF50; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Activate Account</a>`, // html body
};
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", user.Email);
    return { success: true, message: "Email sent successfully" };  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email", error };
  }
}

module.exports = {
  sendEmailTo,
};
