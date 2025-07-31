# Contact Form Setup Guide

## Overview
The contact form functionality has been implemented with the following features:
- Popup modal form for each contact button
- Email notifications to admin (intern.linuxworld@gmail.com)
- Confirmation emails to users
- Form validation and error handling

## Setup Instructions

### 1. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "JAZBAA Contact Form"
   - Copy the generated 16-character password

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
GMAIL_APP_PASSWORD=your_16_character_app_password_here
PORT=3001
```

### 3. Install Dependencies
```bash
npm install nodemailer express cors dotenv
```

### 4. Start the Server
```bash
npm run server
```

### 5. Start the Frontend
```bash
npm run dev
```

## Features

### Contact Form Modal
- **Contact Founders**: For general inquiries about the startup
- **Call Us**: For scheduling calls with the team
- **Request Detailed Deck**: For pitch deck requests
- **Support via CSR**: For corporate social responsibility inquiries

### Email Notifications
- **Admin Email**: Sent to intern.linuxworld@gmail.com with contact details
- **User Confirmation**: Sent to the user confirming their request
- **Professional HTML Templates**: Styled emails with JAZBAA branding

### Form Fields
- **Full Name** (required)
- **Email Address** (required)
- **Phone Number** (optional)
- **Message** (required) - "What are you looking for?"

## API Endpoints

### POST /api/contact
Handles contact form submissions and sends emails.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in your startup",
  "contactType": "founders",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Contact request submitted successfully"
}
```

## Error Handling
- Form validation for required fields
- Network error handling
- Email sending error handling
- User-friendly error messages

## Security Notes
- Gmail app password is stored in environment variables
- CORS is enabled for development
- Input validation on both client and server
- No sensitive data logging

## Testing
1. Start both server and frontend
2. Navigate to any startup profile page
3. Click any of the contact buttons
4. Fill out the form and submit
5. Check email inboxes for notifications

## Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail account
- Ensure server is running on port 3001
- Check console for error messages

### Modal Not Opening
- Check browser console for JavaScript errors
- Verify ContactFormModal component is imported
- Ensure all required props are passed

### API Connection Issues
- Verify server is running: `npm run server`
- Check if port 3001 is available
- Ensure CORS is properly configured 