This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Forms, Sheets, and Trustpilot

This site can send enquiries/leads and feedback submissions to Google Sheets (via a service account). `.env.local` is ignored by git; set these in your host (e.g. Netlify) for production.

### Google Sheets (server-side)

- `GOOGLE_APPLICATION_CREDENTIALS`: service account JSON as either:
  - raw JSON string, or
  - base64-encoded JSON string (recommended for Netlify), or
  - an absolute path to a local `.json` file (local dev only).

**Leads**

- `LEADS_SHEET_ID`: Google Spreadsheet ID
- `LEADS_SHEET_RANGE`: append range (default `Leads!A1`)

**Feedback**

- `FEEDBACK_SHEET_ID`: Google Spreadsheet ID
- `FEEDBACK_SHEET_RANGE`: append range (default `Feedback!A1`)
- `FEEDBACK_SHEET_READ_RANGE`: read range (default `Feedback!A2:K`)
- `FEEDBACK_REQUIRE_APPROVAL`: set `true` to require manual approval before showing testimonials.

### Trustpilot (client-side widget)

To show live Trustpilot reviews on the homepage, set:

- `NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID`
- `NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID`
- `NEXT_PUBLIC_TRUSTPILOT_LOCALE` (optional, default `en-GB`)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
