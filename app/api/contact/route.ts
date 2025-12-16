import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactEmail from './email-template';

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

    // Send email using Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission from ${name}`,
      react: ContactEmail({ name, email, organization, role, message }),
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
