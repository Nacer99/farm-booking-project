const { sendEmail } = require('../services/emailService');

// In your booking confirmation function:
try {
  await sendEmail(
    userEmail,
    'Booking Confirmation',
    'Your booking at [Farm Name] for [Date] has been confirmed. Menu: [Menu Details]',
    '<h1>Booking Confirmation</h1><p>Your booking at [Farm Name] for [Date] has been confirmed.</p><p>Menu: [Menu Details]</p>'
  );
  // Handle successful email sending
} catch (error) {
  console.error('Error sending email:', error);
  // Handle email sending error
}