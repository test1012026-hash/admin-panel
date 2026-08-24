# SecureDocShare Admin Panel

React + Vite + Tailwind admin console for SecureDocShare. Talks to the existing Express API under `/api/admin`.

## Setup

```bash
cd adminpanel
npm install
npm run dev
```

Opens on http://localhost:5174 (proxies `/api` to `http://localhost:4000`).

## Seed Super Admin

From `server/` (PowerShell):

```powershell
$env:SUPER_ADMIN_EMAIL="admin@example.com"; $env:SUPER_ADMIN_PASSWORD="YourLongPass12"; npm run seed:super-admin
```

## Hierarchy

- **Super Admin** (`role: "super_admin"`) — global settings, provision resellers, extend subscriptions
- **Reseller** — group admins, subscribers, monthly subscription management
- **Group Admin** — org users, invites
- **Subscriber** — end users (extension); invited via admin

Access for sending is gated by **`subscriptionExpiresAt`** (90-day / 3-month periods from `FREE_TRIAL_DAYS`).

## Main APIs

| Area | Base path |
|------|-----------|
| Auth / profile | `/api/admin/auth` |
| Subscribers / Groups (scoped lists) | `/api/admin/users?role=` |
| Invitations | `/api/admin/invitations` |
| Settings (token expiry default 4h) | `/api/admin/settings` |
| Activity logs | `/api/admin/activity` |
| Analytics summary | `/api/admin/analytics/summary` |
