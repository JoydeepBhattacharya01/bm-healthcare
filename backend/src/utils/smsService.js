const axios = require('axios');

// Send SMS using TextLocal or Twilio
const sendSMS = async (phone, message) => {
  try {
    // Using TextLocal (Indian SMS Gateway)
    if (process.env.SMS_BASE_URL && process.env.SMS_API_KEY) {
      const response = await axios.post(process.env.SMS_BASE_URL, null, {
        params: {
          apikey: process.env.SMS_API_KEY,
          numbers: phone,
          message: message,
          sender: process.env.SMS_SENDER_ID || 'BMHEALTH'
        }
      });
      
      console.log('SMS sent successfully:', response.data);
      return { success: true, data: response.data };
    }
    
    // Alternative: Using Twilio
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // const result = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${phone}`
    // });
    // return { success: true, data: result };
    
    return { success: false, message: 'SMS service not configured' };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// SMS Templates
const smsTemplates = {
  appointmentBooked: (name, doctorName, date, time, bookingId) => 
    `Dear ${name}, your appointment with Dr. ${doctorName} is booked for ${date} at ${time}. Booking ID: ${bookingId}. BM Healthcare`,
  
  appointmentConfirmed: (name, doctorName, date, time, bookingId) => 
    `Dear ${name}, your appointment with Dr. ${doctorName} on ${date} at ${time} is confirmed. Booking ID: ${bookingId}. BM Healthcare`,
  
  appointmentCancelled: (name, doctorName, date, bookingId) => 
    `Dear ${name}, your appointment with Dr. ${doctorName} on ${date} has been cancelled. Booking ID: ${bookingId}. BM Healthcare`,
  
  testBooked: (name, testName, date, time, bookingId) => 
    `Dear ${name}, your test booking for ${testName} is scheduled on ${date} at ${time}. Booking ID: ${bookingId}. BM Healthcare`,
  
  testConfirmed: (name, testName, date, time, bookingId) => 
    `Dear ${name}, your test ${testName} on ${date} at ${time} is confirmed. Booking ID: ${bookingId}. BM Healthcare`,
  
  reportReady: (name, testName, bookingId) => 
    `Dear ${name}, your ${testName} report is ready. Booking ID: ${bookingId}. Check online or visit us. BM Healthcare`,
  
  paymentSuccess: (name, amount, bookingType, bookingId) => 
    `Dear ${name}, payment of Rs.${amount} for ${bookingType} received successfully. Booking ID: ${bookingId}. BM Healthcare`
};

module.exports = { sendSMS, smsTemplates };
