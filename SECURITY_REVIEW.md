# Security and Privacy Verification

## HTTPS and Transport Security
- Added middleware that upgrades HTTP requests to HTTPS for production hosts and returns HSTS headers for compliant browsers.
- The middleware also sets `Content-Security-Policy: upgrade-insecure-requests` to prevent mixed content when pages are served over HTTPS.

## Cookie Handling
- The application does not set first-party cookies as part of authentication or session handling; Firebase uses client-side storage by default. Should cookies be added later, they must include the `Secure`, `HttpOnly`, and `SameSite=Lax` (or stricter) attributes to align with this review.

## Sensitive Data in Logs
- Removed contact-form logging that previously echoed environment and delivery details to avoid capturing user-supplied PII in server logs.

## Third-Party Scripts and Services
- Firebase SDKs are loaded for authentication, Firestore access, and optional analytics. Analytics initialization is gated by the presence of `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` and only runs in the browser.
- Resend is used in the `/api/contact` endpoint solely for transactional email delivery and now operates without emitting user details to logs.
- AOS is included for client-side animations and does not transmit data off-site.
