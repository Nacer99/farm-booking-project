const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (email, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Booking Confirmation',
      text: `Your booking for ${booking.farm.name} on ${booking.date.toLocaleDateString()} has been confirmed. Total amount: $${booking.totalAmount}`,
      html: `<p>Your booking for <strong>${booking.farm.name}</strong> on <strong>${booking.date.toLocaleDateString()}</strong> has been confirmed.</p><p>Total amount: $${booking.totalAmount}</p>`
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};