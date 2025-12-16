// Quick test script to verify Resend is working
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Testing Resend configuration...\n');

  console.log('Environment variables:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('- CONTACT_EMAIL_TO:', process.env.CONTACT_EMAIL_TO || '✗ Missing');
  console.log('- CONTACT_EMAIL_FROM:', process.env.CONTACT_EMAIL_FROM || '✗ Missing');
  console.log('');

  if (!process.env.RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY is not set!');
    process.exit(1);
  }

  try {
    console.log('Sending test email via Resend...');
    const data = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      subject: 'Test Email from Football EyeQ',
      html: '<h1>Test Email</h1><p>This is a test email from your contact form integration.</p>',
    });

    console.log('✓ Email sent successfully!');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('✗ Error sending email:', error);
    process.exit(1);
  }
}

testResend();
