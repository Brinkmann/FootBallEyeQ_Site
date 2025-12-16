import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, role, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_EMAIL_TO;
    const fromEmail = process.env.CONTACT_EMAIL_FROM;

    console.log('Environment variables:', {
      hasApiKey: !!process.env.RESEND_API_KEY,
      toEmail,
      fromEmail
    });

    if (!toEmail || !fromEmail) {
      console.error('Missing CONTACT_EMAIL_TO or CONTACT_EMAIL_FROM environment variables');
      return NextResponse.json(
        { error: 'Email configuration error' },
        { status: 500 }
      );
    }

    console.log('Sending email via Resend...');

    // Create HTML email template
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #A10115;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 30px 20px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: 600;
      color: #666666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      color: #333333;
      font-size: 16px;
    }
    .message-box {
      background-color: #F0EFEA;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #A10115;
      margin-top: 10px;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #f8f8f8;
      padding: 20px;
      text-align: center;
      color: #999999;
      font-size: 12px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value">
          <a href="mailto:${email}" style="color: #A10115; text-decoration: none;">${email}</a>
        </div>
      </div>
      ${organization ? `
      <div class="field">
        <div class="field-label">Club / Organization</div>
        <div class="field-value">${organization}</div>
      </div>
      ` : ''}
      ${role ? `
      <div class="field">
        <div class="field-label">Role</div>
        <div class="field-value">${role}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent from the Football EyeQ contact form
    </div>
  </div>
</body>
</html>
    `;

    // Send email using Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: htmlEmail,
      // Fallback text version
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}
Role: ${role || 'Not provided'}

Message:
${message}
      `,
    });

    console.log('Email sent successfully:', data);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
