This is a [Next.js](https://nextjs.org)
dnmdsmsmlmlproject bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WebAuthn security notes

The app exposes WebAuthn endpoints under `/api/auth/webauthn/*` for passkey registration and authentication.

- `POST /api/auth/webauthn/register/options` and `POST /api/auth/webauthn/login/options` generate options, a signed challenge token, and a CSRF token.
- `POST /api/auth/webauthn/register/verify` and `POST /api/auth/webauthn/login/verify` require:
  - `x-webauthn-csrf` header with the CSRF token from the corresponding options response
  - challenge token validation (purpose, origin, expiry, CSRF binding, and user binding for registration)
  - WebAuthn origin/RP ID verification via `@simplewebauthn/server`

Challenge/session pattern:

- Challenges are generated with `crypto.randomBytes(...)`
- Challenge state is stored in a short-lived signed JWT (`WEBAUTHN_CHALLENGE_SECRET`, fallback `JWT_SECRET`)
- Passkey material and counters are persisted via existing account service methods (`save_passkey`, `find_user_passkey`) and counters are rotated after successful assertions
