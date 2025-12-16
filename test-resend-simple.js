// Simpler Resend test
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testSimple() {
  console.log('Testing with simple text email...\n');

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'oliver@football-eyeq.com',
      subject: 'Simple Test',
      html: '<p>Test email</p>',
    });

    console.log('Success! Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
    if (error.message) console.error('Message:', error.message);
    if (error.statusCode) console.error('Status:', error.statusCode);
  }
}

testSimple();
