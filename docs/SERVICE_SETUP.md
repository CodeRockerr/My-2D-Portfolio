# Service setup

## Current state

- The portfolio and every content page run without external service credentials.
- Feedback supports Formspree, but no account or real form ID has been configured.
- Until configured, the form prepares an email draft. The visitor sends it using their own email app.
- PostHog is deferred at Adit’s request. No analytics package, event capture, cookies or session recording have been added.

## Activate the private feedback inbox

1. Create an account at [Formspree](https://formspree.io/) and verify the email address where you want to receive feedback.
2. Create a form for the portfolio and choose your destination inbox. Copy its endpoint, which looks like `https://formspree.io/f/abcdefgh`.
3. In `vite-project/`, copy `.env.example` to `.env.local`. If `.env.local` already exists, edit it without overwriting other settings.
4. Set `VITE_FORMSPREE_FORM_ID=abcdefgh`, replacing the example with your actual form ID. This is a public form identifier. Do not use an account API key or password.
5. Restart `npm run dev`. Visit `/feedback/`. The button should now say **Send private note** and the explanatory text should identify Formspree.
6. Submit your own test note. Confirm that it appears in your Formspree submissions dashboard and, if enabled there, your notification email. The website displays a success message only when the provider accepts the request.
7. Review the provider’s spam controls, allowed domains and retention settings. The form includes a honeypot, but server-side spam filtering and rate limits belong to the provider. Browser validation is not a replacement for those controls.
8. When you decide to deploy, set the same public form ID as a Vercel environment variable and rebuild. Never commit `.env.local`.

Name and email are optional. Submissions are private; there is no public comment wall. If the provider is unavailable, the form preserves the message and offers an email draft and copy button. The client also handles timeouts and HTTP 429 responses.

The form requires a message of 10–3,000 characters. Avoid changing these limits without updating both the HTML and `src/feedback-core.js`. No feedback is stored in localStorage, put into analytics events or rendered as raw HTML.

The browser tests intercept requests to the dummy test ID. They verify integration behavior without submitting real messages. A real inbox delivery check still requires your configured form.

Reference: [Formspree AJAX submissions](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/).

## PostHog: setup for a later phase

You do not need to do this to test or deploy the current portfolio.

1. Create a [PostHog](https://posthog.com/) account and a project for the portfolio; choose your preferred hosting region.
2. Locate the project’s public project token and ingestion host in its setup/settings screen. Keep your personal API key private.
3. When ready to implement analytics, provide the chosen host and put the public project token into a local environment variable. The current code does not read any PostHog variable, so adding a token alone will not activate tracking.
4. Start with deliberate events: page views, project opens, résumé-link clicks, Scholar/GitHub clicks and studio entry. Use coarse campaign tags for future application links.
5. Decide on consent behavior and update `/privacy/` before activation. Keep session recording and form autocapture disabled initially. Never capture feedback text, email addresses or names as ordinary analytics properties.
6. Check a test visit in the project dashboard before deploying the integration.

PostHog does not discover a visitor’s real name or employer automatically. An application-specific link indicates which link was used, not who opened it. Untagged links already sent with job applications cannot gain past attribution retrospectively.

References: [PostHog installation](https://posthog.com/docs/getting-started/install), [JavaScript SDK](https://posthog.com/docs/libraries/js), [identification](https://posthog.com/docs/product-analytics/identify), [privacy controls](https://posthog.com/docs/privacy).
