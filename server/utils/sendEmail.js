const createTransporter = require('../config/email');
const EmailLog = require('../models/EmailLog');

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log successful email
    await EmailLog.create({
      to: options.to,
      subject: options.subject,
      body: options.html,
      complaintId: options.complaintId,
      userId: options.userId,
      status: 'sent',
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);

    // Log failed email
    await EmailLog.create({
      to: options.to,
      subject: options.subject,
      body: options.html,
      complaintId: options.complaintId,
      userId: options.userId,
      status: 'failed',
      error: error.message,
    });

    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
