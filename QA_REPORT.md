# QA Report: Primary User Flows

## Signup / Login
- Attempted account creation and login with test credentials.
- Both flows fail with `Firebase: Error (auth/api-key-not-valid...)` because the app is pointed at placeholder Firebase config values; authentication cannot proceed without valid keys.
- Screenshot: ![Signup error](browser:/invocations/qclspuju/artifacts/artifacts/signup_attempt.png) and ![Login error](browser:/invocations/qclspuju/artifacts/artifacts/login_attempt.png).

## Profile Update
- Navigating to `/profile` immediately prompts “Please log in to view your profile.”
- Blocked because authentication is unavailable, so profile data cannot be loaded or edited.
- Screenshot: ![Profile requires login](browser:/invocations/qclspuju/artifacts/artifacts/profile_access.png).

## Search / Filter (Drill Catalogue)
- `/catalog` renders the filter UI but shows “No drills found” and `0 of 0 drills`.
- The page relies on Firestore `exercises` data; with no database connection the catalogue is empty, so filters and search have nothing to operate on.
- Screenshot: ![Empty catalogue](browser:/invocations/qclspuju/artifacts/artifacts/catalog_empty.png).

## Add-to-Cart → Checkout / Payment
- No cart/checkout UI exists; navigating to `/cart` returns a 404 page.
- Flow is blocked because ecommerce paths are not implemented in the current app.
- Screenshot: ![Cart 404](browser:/invocations/qclspuju/artifacts/artifacts/cart_missing.png).

## Contact / Feedback Submission
- Submitted the contact form with sample data; the app displayed “Message Sent!” success state even with placeholder Resend credentials.
- Email delivery is not verified in this environment, but the UI completes the flow without error.
- Screenshot: ![Contact success](browser:/invocations/qclspuju/artifacts/artifacts/contact_submission.png).
