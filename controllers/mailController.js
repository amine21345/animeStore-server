const sendEmail = require("../config/mailer");

exports.sendTestEmail = async (req, res) => {
  try {
    await sendEmail({
      to: req.body.to,
      subject: "Test Email from Express App",
      text: "This is a plain text message.",
      html: "<h1>Hello!</h1><p>This is a test email.</p>",
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
};
