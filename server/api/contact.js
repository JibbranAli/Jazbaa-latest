const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'intern.linuxworld@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Use environment variable for security
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, contactType, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get contact type info
    const getContactTypeInfo = (type) => {
      switch (type) {
        case 'founders':
          return { title: 'Contact Founders', description: 'Get in touch with our startup founders' };
        case 'call':
          return { title: 'Call Us', description: 'Schedule a call with our team' };
        case 'deck':
          return { title: 'Request Detailed Deck', description: 'Get our comprehensive pitch deck' };
        case 'csr':
          return { title: 'Support via CSR', description: 'Corporate Social Responsibility support' };
        default:
          return { title: 'Contact Us', description: 'Get in touch with our team' };
      }
    };

    const contactInfo = getContactTypeInfo(contactType);

    // Email content
    const emailSubject = `JAZBAA Contact Request: ${contactInfo.title}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e86888; margin-bottom: 20px;">JAZBAA Contact Request</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">${contactInfo.title}</h3>
          <p style="color: #666; margin-bottom: 10px;">${contactInfo.description}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: #333; margin-bottom: 10px;">Contact Details:</h4>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: #333; margin-bottom: 10px;">Message:</h4>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #e86888;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724;">
            <strong>Action Required:</strong> Please respond to this contact request within 24-48 hours.
          </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This is an automated message from the JAZBAA platform.
        </p>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: 'intern.linuxworld@gmail.com',
      to: 'intern.linuxworld@gmail.com',
      subject: emailSubject,
      html: emailBody,
      replyTo: email // Set reply-to as the contact's email
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to the contact
    const confirmationSubject = 'JAZBAA Contact Request Received';
    const confirmationBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e86888; margin-bottom: 20px;">Thank You for Contacting JAZBAA</h2>
        
        <p>Dear ${name},</p>
        
        <p>We have received your contact request regarding <strong>${contactInfo.title}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #333; margin-bottom: 10px;">Your Message:</h4>
          <p style="background-color: white; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>Our team will get back to you within 24-48 hours.</strong>
          </p>
        </div>
        
        <p style="margin-top: 20px;">Best regards,<br>The JAZBAA Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This is an automated confirmation email.
        </p>
      </div>
    `;

    const confirmationMailOptions = {
      from: 'intern.linuxworld@gmail.com',
      to: email,
      subject: confirmationSubject,
      html: confirmationBody
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ message: 'Contact request submitted successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to submit contact request' });
  }
} 