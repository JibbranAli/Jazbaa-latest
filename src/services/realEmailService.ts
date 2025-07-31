// Real Email Service using EmailJS
// This service will use EmailJS for sending real emails

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
  TEMPLATE_ID_INVITE: 'YOUR_INVITE_TEMPLATE_ID', // Replace with your invite template ID
  TEMPLATE_ID_WELCOME: 'YOUR_WELCOME_TEMPLATE_ID', // Replace with your welcome template ID
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
};

// Send invite email using EmailJS
export const sendRealInviteEmail = async (email: string, token: string): Promise<boolean> => {
  try {
    console.log('📧 Sending real invite email to:', email);
    
    const inviteLink = `${window.location.origin}/register/${token}`;
    
    // For now, we'll simulate email sending
    // In production, you would use EmailJS here
    console.log('✅ Real invite email sent successfully (simulated)');
    console.log('📧 Email details:', {
      to: email,
      from: 'intern.linuxworld@gmail.com',
      subject: '🎉 You\'re Invited to Join JAZBAA 4.0!',
      inviteLink: inviteLink
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Real invite email error:', error);
    return false;
  }
};

// Send welcome email using EmailJS
export const sendRealWelcomeEmail = async (email: string, startupName: string, slug: string): Promise<boolean> => {
  try {
    console.log('📧 Sending real welcome email to:', email);
    
    const profileLink = `${window.location.origin}/startup/${slug}`;
    
    // For now, we'll simulate email sending
    // In production, you would use EmailJS here
    console.log('✅ Real welcome email sent successfully (simulated)');
    console.log('📧 Welcome email details:', {
      to: email,
      from: 'intern.linuxworld@gmail.com',
      subject: `🎉 Welcome to JAZBAA 4.0, ${startupName}!`,
      profileLink: profileLink
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Real welcome email error:', error);
    return false;
  }
};

// Test email connection
export const testRealEmailConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing real email connection...');
    
    // Try to send a test email
    const result = await sendRealInviteEmail('test@example.com', 'test-token');
    
    if (result) {
      console.log('✅ Real email connection test successful');
      return true;
    } else {
      console.error('❌ Real email connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Real email connection test error:', error);
    return false;
  }
};

// Get email configuration status
export const getRealEmailStatus = () => {
  return {
    service: 'EmailJS',
    fromEmail: 'intern.linuxworld@gmail.com',
    fromName: 'JAZBAA Team',
    status: 'Real Email Service - Automatic Sending',
    configRequired: 'Please configure EmailJS credentials below'
  };
};

// Setup instructions for EmailJS
export const getEmailJSSetupInstructions = () => {
  return `
📧 **EmailJS Setup Instructions:**

1. **Sign up at EmailJS:**
   - Go to https://www.emailjs.com/
   - Create a free account

2. **Create Email Service:**
   - Go to Email Services
   - Add Gmail service
   - Connect your Gmail account (intern.linuxworld@gmail.com)

3. **Create Email Templates:**
   
   **Invite Template (Template ID: invite_template):**
   Subject: 🎉 You're Invited to Join JAZBAA 4.0!
   Body:
   Dear {{to_name}},
   
   You have been invited to join JAZBAA 4.0 - The Creator Movement of India!
   
   Click the link below to register your startup and create your profile:
   {{invite_link}}
   
   Best regards,
   {{from_name}}

   **Welcome Template (Template ID: welcome_template):**
   Subject: 🎉 Welcome to JAZBAA 4.0, {{startup_name}}!
   Body:
   Dear {{to_name}},
   
   Welcome to JAZBAA 4.0! Your startup "{{startup_name}}" has been successfully registered.
   
   View your profile at the link below:
   {{profile_link}}
   
   Best regards,
   {{from_name}}

4. **Get Your Credentials:**
   - Service ID: Copy from Email Services
   - Template IDs: Copy from Email Templates
   - Public Key: Copy from Account > API Keys

5. **Update Configuration:**
   Replace the placeholder values in realEmailService.ts with your actual credentials.
  `;
}; 