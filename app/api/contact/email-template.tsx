import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  organization?: string;
  role?: string;
  message: string;
}

export default function ContactEmail({
  name,
  email,
  organization,
  role,
  message,
}: ContactEmailProps) {
  return (
    <html>
      <head>
        <style>{`
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
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            color: #999999;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div className="content">
            <div className="field">
              <div className="field-label">Name</div>
              <div className="field-value">{name}</div>
            </div>

            <div className="field">
              <div className="field-label">Email Address</div>
              <div className="field-value">
                <a href={`mailto:${email}`} style={{ color: '#A10115', textDecoration: 'none' }}>
                  {email}
                </a>
              </div>
            </div>

            {organization && (
              <div className="field">
                <div className="field-label">Club / Organization</div>
                <div className="field-value">{organization}</div>
              </div>
            )}

            {role && (
              <div className="field">
                <div className="field-label">Role</div>
                <div className="field-value">{role}</div>
              </div>
            )}

            <div className="field">
              <div className="field-label">Message</div>
              <div className="message-box">
                {message.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < message.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="footer">
            This message was sent from the Football EyeQ contact form
          </div>
        </div>
      </body>
    </html>
  );
}
