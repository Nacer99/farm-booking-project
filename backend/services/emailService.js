const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

async function sendEmail(to, subject, textPart, htmlPart) {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "nacerficationspirit@gmail.com",
            Name: "Farm Booking"
          },
          To: [
            {
              Email: to
            }
          ],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart
        }
      ]
    });
    console.log("Email sent successfully");
    return result.body;
  } catch (error) {
    console.error("Failed to send email:", error.statusCode);
    throw error;
  }
}

module.exports = { sendEmail };